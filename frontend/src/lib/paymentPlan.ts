export type PaymentChargeType = 'tuition' | 'clinic_fee' | 'exam_fee' | 'late_fee'
export type PaymentPlan = 'full' | 'installment'

export type InstallmentScheduleRow = {
  installmentNumber: number
  tuitionAmount: number
  serviceFee: number
  totalDue: number
}

const MIN_INSTALLMENTS = 1
const MAX_INSTALLMENTS = 3

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100
}

function clampInstallmentCount(count: number): number {
  if (!Number.isFinite(count)) return MAX_INSTALLMENTS
  const whole = Math.trunc(count)
  if (whole < MIN_INSTALLMENTS) return MIN_INSTALLMENTS
  if (whole > MAX_INSTALLMENTS) return MAX_INSTALLMENTS
  return whole
}

export function isInstallmentEligible(chargeType: PaymentChargeType): boolean {
  return chargeType === 'tuition'
}

export function calculateInstallmentSchedule(
  totalTuition: number,
  installmentCount: number,
  serviceFeePerInstallment: number,
): {
  schedule: InstallmentScheduleRow[]
  totalTuitionAmount: number
  totalServiceFees: number
  totalPayableAmount: number
} {
  const safeTuition = Math.max(0, roundMoney(totalTuition))
  const safeServiceFee = Math.max(0, roundMoney(serviceFeePerInstallment))
  const safeCount = clampInstallmentCount(installmentCount)
  const totalTuitionCents = Math.round(safeTuition * 100)
  const baseCents = Math.floor(totalTuitionCents / safeCount)
  const remainderCents = totalTuitionCents % safeCount

  const schedule: InstallmentScheduleRow[] = []
  for (let i = 0; i < safeCount; i += 1) {
    const tuitionCents = baseCents + (i < remainderCents ? 1 : 0)
    const tuitionAmount = roundMoney(tuitionCents / 100)
    const totalDue = roundMoney(tuitionAmount + safeServiceFee)
    schedule.push({
      installmentNumber: i + 1,
      tuitionAmount,
      serviceFee: safeServiceFee,
      totalDue,
    })
  }

  const totalServiceFees = roundMoney(safeServiceFee * safeCount)
  return {
    schedule,
    totalTuitionAmount: safeTuition,
    totalServiceFees,
    totalPayableAmount: roundMoney(safeTuition + totalServiceFees),
  }
}
