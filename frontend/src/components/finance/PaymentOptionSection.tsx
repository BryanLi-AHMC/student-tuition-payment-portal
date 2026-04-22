import { formatMoney } from '@/lib/formatMoney'
import type { CurrentTermBillingCharge } from '@/lib/api'
import {
  calculateInstallmentSchedule,
  type PaymentChargeType,
  type PaymentPlan,
} from '@/lib/paymentPlan'

type PaymentOptionSectionProps = {
  tuitionCharge: CurrentTermBillingCharge
  clinicFeeCharge: CurrentTermBillingCharge
  examFeeCharge: CurrentTermBillingCharge
  lateFeeCharge: CurrentTermBillingCharge
  paymentDeadline: string | null
  paymentPlan: PaymentPlan
  installmentCount: number
  serviceFeePerInstallment: number
  selectedChargeType: PaymentChargeType
  onPaymentPlanChange: (next: PaymentPlan) => void
  onSelectChargeType: (next: PaymentChargeType) => void
}

function installmentOrdinal(n: number): string {
  if (n === 1) return '1st'
  if (n === 2) return '2nd'
  if (n === 3) return '3rd'
  return `${n}th`
}

export function PaymentOptionSection({
  tuitionCharge,
  clinicFeeCharge,
  examFeeCharge,
  lateFeeCharge,
  paymentDeadline,
  paymentPlan,
  installmentCount,
  serviceFeePerInstallment,
  selectedChargeType,
  onPaymentPlanChange,
  onSelectChargeType,
}: PaymentOptionSectionProps) {
  const tuitionAmountDue = Math.max(0, tuitionCharge.amountDue)
  const schedule = calculateInstallmentSchedule(tuitionAmountDue, installmentCount, serviceFeePerInstallment)
  const hasAdditionalRequiredFees = clinicFeeCharge.amountDue > 0 || examFeeCharge.amountDue > 0

  return (
    <div className="portal-finance-billing-stack">
      <section className="portal-card portal-finance-payment-option" aria-labelledby="payment-option-heading">
        <header className="portal-finance-payment-option__header">
          <h2 id="payment-option-heading" className="portal-section-heading">
            Tuition
          </h2>
        </header>
        <dl className="portal-finance-checkout-summary">
          <div className="portal-finance-checkout-summary__row">
            <dt>Total tuition charge</dt>
            <dd>{formatMoney(tuitionCharge.amount)}</dd>
          </div>
          <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
            <dt>Tuition due now</dt>
            <dd>{formatMoney(tuitionAmountDue)}</dd>
          </div>
        </dl>

        <div className="portal-finance-payment-option__cards" role="radiogroup" aria-label="Payment option">
          <button
            type="button"
            className={`portal-finance-payment-option__card ${paymentPlan === 'full' ? 'is-selected' : ''}`}
            role="radio"
            aria-checked={paymentPlan === 'full'}
            onClick={() => {
              onPaymentPlanChange('full')
              onSelectChargeType('tuition')
            }}
            disabled={tuitionAmountDue <= 0}
          >
            <span className="portal-finance-payment-option__card-content">
              <span className="portal-finance-payment-option__card-title">Pay in Full</span>
              <span className="portal-finance-payment-option__card-copy">
                Pay all unpaid tuition for this term in one payment.
              </span>
            </span>
          </button>
          <button
            type="button"
            className={`portal-finance-payment-option__card ${paymentPlan === 'installment' ? 'is-selected' : ''}`}
            role="radio"
            aria-checked={paymentPlan === 'installment'}
            onClick={() => {
              onPaymentPlanChange('installment')
              onSelectChargeType('tuition')
            }}
            disabled={tuitionAmountDue <= 0}
          >
            <span className="portal-finance-payment-option__card-content">
              <span className="portal-finance-payment-option__card-title">Pay by Installments</span>
              <span className="portal-finance-payment-option__card-copy">
                Up to 3 installments per quarter. A $15 non-refundable service fee applies to each installment.
              </span>
            </span>
          </button>
        </div>
        <p className="portal-finance-payment-option__note">Installment plans apply to tuition only.</p>

        {paymentPlan === 'installment' && tuitionAmountDue > 0 ? (
          <section className="portal-finance-installment-schedule" aria-labelledby="installment-schedule-heading">
            <h3 id="installment-schedule-heading" className="portal-section-heading">
              Installment Schedule
            </h3>
            <ul className="portal-finance-installment-schedule__list">
              {schedule.schedule.map((row) => (
                <li key={row.installmentNumber}>
                  {installmentOrdinal(row.installmentNumber)} installment: {formatMoney(row.tuitionAmount)} +{' '}
                  {formatMoney(row.serviceFee)} service fee
                </li>
              ))}
            </ul>
            <dl className="portal-finance-checkout-summary">
              <div className="portal-finance-checkout-summary__row">
                <dt>Total tuition amount</dt>
                <dd>{formatMoney(schedule.totalTuitionAmount)}</dd>
              </div>
              <div className="portal-finance-checkout-summary__row">
                <dt>Total tuition service fees</dt>
                <dd>{formatMoney(schedule.totalServiceFees)}</dd>
              </div>
              <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
                <dt>Total payable amount</dt>
                <dd>{formatMoney(schedule.totalPayableAmount)}</dd>
              </div>
            </dl>
          </section>
        ) : null}
      </section>

      {hasAdditionalRequiredFees ? (
        <section className="portal-card portal-finance-payment-option" aria-labelledby="additional-fees-heading">
          <header className="portal-finance-payment-option__header">
            <h2 id="additional-fees-heading" className="portal-section-heading">
              Additional Required Fees
            </h2>
          </header>
          <p className="portal-finance-payment-option__note">
            Clinic and exam fees are separate required charges and are not eligible for installment plans.
          </p>
          <div className="portal-finance-required-fees">
            {clinicFeeCharge.amountDue > 0 ? (
              <div className="portal-finance-required-fees__row">
                <span>Clinic Fee</span>
                <span>{formatMoney(clinicFeeCharge.amountDue)}</span>
                <span>Due Now</span>
                <button
                  type="button"
                  className={`portal-btn portal-btn--secondary ${selectedChargeType === 'clinic_fee' ? 'is-selected' : ''}`}
                  onClick={() => onSelectChargeType('clinic_fee')}
                >
                  Pay Now
                </button>
              </div>
            ) : null}
            {examFeeCharge.amountDue > 0 ? (
              <div className="portal-finance-required-fees__row">
                <span>Exam Fee</span>
                <span>{formatMoney(examFeeCharge.amountDue)}</span>
                <span>Due Now</span>
                <button
                  type="button"
                  className={`portal-btn portal-btn--secondary ${selectedChargeType === 'exam_fee' ? 'is-selected' : ''}`}
                  onClick={() => onSelectChargeType('exam_fee')}
                >
                  Pay Now
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {lateFeeCharge.amountDue > 0 ? (
        <section className="portal-card portal-finance-payment-option" aria-labelledby="late-fee-heading">
          <header className="portal-finance-payment-option__header">
            <h2 id="late-fee-heading" className="portal-section-heading">
              Late Fee
            </h2>
          </header>
          <dl className="portal-finance-checkout-summary">
            <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
              <dt>Late Fee</dt>
              <dd>{formatMoney(lateFeeCharge.amountDue)}</dd>
            </div>
          </dl>
          <p className="portal-finance-payment-option__note">
            Applied because payment was not completed by the term payment deadline.
          </p>
          <p className="portal-finance-payment-option__note">
            A $30 late fee applies after the term payment deadline if any required current-term charges remain unpaid.
            {paymentDeadline ? ` Payment deadline: ${paymentDeadline}.` : ''}
          </p>
          <button
            type="button"
            className={`portal-btn portal-btn--secondary ${selectedChargeType === 'late_fee' ? 'is-selected' : ''}`}
            onClick={() => onSelectChargeType('late_fee')}
          >
            Pay Now
          </button>
        </section>
      ) : null}
    </div>
  )
}
