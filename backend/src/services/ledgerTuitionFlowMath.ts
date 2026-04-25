import type { BillingCategory } from "../types/studentAccount.js";
import {
  isClinicBucketCharge,
  isExamFeeMemo,
  isLateFeeRow,
} from "./billingChargeBuckets.js";

export type PaymentChargeBucket = "tuition" | "clinic_fee" | "exam_fee" | "late_fee";

export type LedgerRowForTuitionFlow = {
  type: string;
  code: string;
  memo: string;
  debit: number;
  credit: number;
  sourceType?: string;
  billingAdjustmentSource?: string;
  /** Set for portal billing adjustment rows so clinical/exam post charges never hit Pay Tuition. */
  billingAdjustmentCategory?: BillingCategory;
};

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function inferPaymentChargeTypeFromMemo(memo: string): PaymentChargeBucket | null {
  const m = memo.trim().toLowerCase();
  const explicit = /authorize\.net\s+(tuition|clinic_fee|exam_fee|late_fee)\b/.exec(
    m,
  );
  if (explicit) {
    return explicit[1] as PaymentChargeBucket;
  }
  if (/\btuition\b/.test(m)) return "tuition";
  if (/clinic/.test(m)) return "clinic_fee";
  if (/exam/.test(m)) return "exam_fee";
  if (/late\s*payment\s*fee|late\s*fee/.test(m)) return "late_fee";
  return null;
}

/** Debit-side bucket for term charge allocation (matches Pay Tuition / clinic / exam / late fee flows). */
export function classifyDebitChargeBucket(row: LedgerRowForTuitionFlow): PaymentChargeBucket | null {
  const debit = roundMoney(Math.max(0, Number(row.debit) || 0));
  if (debit <= 0) return null;

  const type = String(row.type ?? "").trim();
  const code = String(row.code ?? "").trim();
  const memo = String(row.memo ?? "").trim();
  const sourceType = String(row.sourceType ?? "").trim();
  const adjCat = row.billingAdjustmentCategory;
  const isAdjustment = type.toLowerCase() === "adjustment";
  const adjSrc = String(row.billingAdjustmentSource ?? "").trim();

  if (
    isLateFeeRow({
      type,
      memo,
      sourceType,
    })
  ) {
    return "late_fee";
  }

  if (isAdjustment && adjCat === "exam") {
    return "exam_fee";
  }
  if (!isAdjustment && isExamFeeMemo(memo)) {
    return "exam_fee";
  }
  if (isAdjustment && adjCat === undefined && isExamFeeMemo(memo)) {
    return "exam_fee";
  }

  if (isAdjustment && adjCat === "clinical") {
    return "clinic_fee";
  }
  if (adjSrc === "system_clinical") {
    return "clinic_fee";
  }
  if (isAdjustment && adjCat === undefined && isClinicBucketCharge({ type, code, memo, sourceType })) {
    return "clinic_fee";
  }
  if (!isAdjustment && isClinicBucketCharge({ type, code, memo, sourceType })) {
    return "clinic_fee";
  }

  if (
    isAdjustment &&
    (adjCat === "tuition" || adjCat === "fees" || adjCat === "other")
  ) {
    return "tuition";
  }

  if (adjCat === undefined) {
    return "tuition";
  }

  return "tuition";
}

export function summarizeLedgerRowsIntoChargeBuckets(rows: LedgerRowForTuitionFlow[]): {
  chargeTotals: Record<PaymentChargeBucket, number>;
  paymentTotals: Record<PaymentChargeBucket, number>;
  unassignedPayments: number;
} {
  const chargeTotals: Record<PaymentChargeBucket, number> = {
    tuition: 0,
    clinic_fee: 0,
    exam_fee: 0,
    late_fee: 0,
  };
  const paymentTotals: Record<PaymentChargeBucket, number> = {
    tuition: 0,
    clinic_fee: 0,
    exam_fee: 0,
    late_fee: 0,
  };
  let totalCredits = 0;
  for (const row of rows) {
    const debit = roundMoney(Math.max(0, Number(row.debit) || 0));
    const credit = roundMoney(Math.max(0, Number(row.credit) || 0));
    if (debit > 0) {
      const bucket = classifyDebitChargeBucket(row);
      if (bucket != null) {
        chargeTotals[bucket] = roundMoney(chargeTotals[bucket] + debit);
      }
    }
    if (credit > 0) {
      totalCredits = roundMoney(totalCredits + credit);
      const memo = String(row.memo ?? "").trim();
      let inferred = inferPaymentChargeTypeFromMemo(memo);
      if (
        inferred == null &&
        String(row.billingAdjustmentSource ?? "").trim() ===
          "system_late_fee_reversal"
      ) {
        inferred = "late_fee";
      }
      if (inferred != null) {
        paymentTotals[inferred] = roundMoney(paymentTotals[inferred] + credit);
      }
    }
  }

  const typedPayments = roundMoney(
    paymentTotals.tuition +
      paymentTotals.clinic_fee +
      paymentTotals.exam_fee +
      paymentTotals.late_fee,
  );
  return {
    chargeTotals,
    paymentTotals,
    unassignedPayments: roundMoney(Math.max(0, totalCredits - typedPayments)),
  };
}

export function distributeUnassignedPaymentsToBuckets(
  chargeTotals: Record<PaymentChargeBucket, number>,
  paymentTotals: Record<PaymentChargeBucket, number>,
  unassignedPayments: number,
): Record<PaymentChargeBucket, number> {
  const paid: Record<PaymentChargeBucket, number> = {
    tuition: 0,
    clinic_fee: 0,
    exam_fee: 0,
    late_fee: 0,
  };
  let carry = roundMoney(Math.max(0, unassignedPayments));
  const order: PaymentChargeBucket[] = [
    "tuition",
    "clinic_fee",
    "exam_fee",
    "late_fee",
  ];
  for (const key of order) {
    const target = roundMoney(Math.max(0, chargeTotals[key]));
    if (target <= 0) continue;
    const direct = roundMoney(Math.max(0, paymentTotals[key]));
    const remainingAfterDirect = roundMoney(Math.max(0, target - direct));
    const allocation = roundMoney(Math.min(remainingAfterDirect, carry));
    carry = roundMoney(Math.max(0, carry - allocation));
    paid[key] = roundMoney(Math.min(target, direct + allocation));
  }
  return paid;
}
