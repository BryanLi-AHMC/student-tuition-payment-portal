/** Minimal ledger row shape for charge-bucket classification. */
export type LedgerChargeRowInput = {
    type: string;
    code: string;
    memo: string;
    debit?: number;
    credit?: number;
    sourceType?: string;
};
export declare function isLateFeeRow(args: {
    type: string;
    memo: string;
    sourceType?: string;
}): boolean;
export declare function isExamFeeMemo(memo: string): boolean;
/**
 * Clinical **booking / reservation** charges (Pay Clinic Fee), not didactic tuition rows.
 * Course-based clinical clock-hour tuition stays in the tuition bucket (portal uses type "Tuition").
 */
export declare function isClinicBucketCharge(args: {
    type: string;
    code: string;
    memo: string;
    sourceType?: string;
}): boolean;
/**
 * Term academic charges that belong with Pay Tuition: course tuition, quarter/institutional fees
 * (e.g. technology/facility, malpractice when posted), tuition installment service fees, and other
 * term charges that are not exam fees, late fees, or clinical booking fees.
 */
export declare function isTuitionBucketCharge(args: {
    type: string;
    code: string;
    memo: string;
    sourceType?: string;
}): boolean;
/** Gross assessed charges in the tuition bucket (sum of debit amounts) for one term ledger. */
export declare function getTermTuitionPayableTotal(rows: Array<{
    type: string;
    code: string;
    memo: string;
    debit: number;
    sourceType?: string;
}>): number;
//# sourceMappingURL=billingChargeBuckets.d.ts.map