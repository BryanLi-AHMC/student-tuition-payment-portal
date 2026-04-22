import { formatMoney } from '@/lib/formatMoney'
import type { CurrentTermBillingCharge } from '@/lib/api'
import { useStudentPortalT } from '@/LanguageContext'
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
  const t = useStudentPortalT()
  const tuitionAmountDue = Math.max(0, tuitionCharge.amountDue)
  const schedule = calculateInstallmentSchedule(tuitionAmountDue, installmentCount, serviceFeePerInstallment)
  const hasAdditionalRequiredFees = clinicFeeCharge.amountDue > 0 || examFeeCharge.amountDue > 0

  return (
    <div className="portal-finance-billing-stack">
      <section className="portal-card portal-finance-payment-option" aria-labelledby="payment-option-heading">
        <header className="portal-finance-payment-option__header">
          <h2 id="payment-option-heading" className="portal-section-heading">
            {t('tuition')}
          </h2>
        </header>
        <dl className="portal-finance-checkout-summary">
          <div className="portal-finance-checkout-summary__row">
            <dt>{t('totalTuitionCharge')}</dt>
            <dd>{formatMoney(tuitionCharge.amount)}</dd>
          </div>
          <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
            <dt>{t('tuitionDueNow')}</dt>
            <dd>{formatMoney(tuitionAmountDue)}</dd>
          </div>
        </dl>

        <div className="portal-finance-payment-option__cards" role="radiogroup" aria-label={t('paymentOptionHeading')}>
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
              <span className="portal-finance-payment-option__card-title">{t('payInFull')}</span>
              <span className="portal-finance-payment-option__card-copy">
                {t('payAllUnpaidTuitionOnePayment')}
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
              <span className="portal-finance-payment-option__card-title">{t('payByInstallments')}</span>
              <span className="portal-finance-payment-option__card-copy">
                {t('upToThreeInstallmentsWithFee')}
              </span>
            </span>
          </button>
        </div>
        <p className="portal-finance-payment-option__note">{t('installmentPlansTuitionOnly')}</p>

        {paymentPlan === 'installment' && tuitionAmountDue > 0 ? (
          <section className="portal-finance-installment-schedule" aria-labelledby="installment-schedule-heading">
            <h3 id="installment-schedule-heading" className="portal-section-heading">
              {t('installmentSchedule')}
            </h3>
            <ul className="portal-finance-installment-schedule__list">
              {schedule.schedule.map((row) => (
                <li key={row.installmentNumber}>
                  {t('nthInstallment')
                    .replace('{n}', String(row.installmentNumber))
                    .replace('{tuition}', formatMoney(row.tuitionAmount))
                    .replace('{fee}', formatMoney(row.serviceFee))}
                </li>
              ))}
            </ul>
            <dl className="portal-finance-checkout-summary">
              <div className="portal-finance-checkout-summary__row">
                <dt>{t('totalTuitionAmount')}</dt>
                <dd>{formatMoney(schedule.totalTuitionAmount)}</dd>
              </div>
              <div className="portal-finance-checkout-summary__row">
                <dt>{t('totalTuitionServiceFees')}</dt>
                <dd>{formatMoney(schedule.totalServiceFees)}</dd>
              </div>
              <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
                <dt>{t('totalPayableAmount')}</dt>
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
              {t('additionalRequiredFees')}
            </h2>
          </header>
          <p className="portal-finance-payment-option__note">
            {t('clinicAndExamFeesNotInstallmentEligible')}
          </p>
          <div className="portal-finance-required-fees">
            {clinicFeeCharge.amountDue > 0 ? (
              <div className="portal-finance-required-fees__row">
                <span>{t('clinicFee')}</span>
                <span>{formatMoney(clinicFeeCharge.amountDue)}</span>
                <span>{t('dueNow')}</span>
                <button
                  type="button"
                  className={`portal-btn portal-btn--secondary ${selectedChargeType === 'clinic_fee' ? 'is-selected' : ''}`}
                  onClick={() => onSelectChargeType('clinic_fee')}
                >
                  {t('payNow')}
                </button>
              </div>
            ) : null}
            {examFeeCharge.amountDue > 0 ? (
              <div className="portal-finance-required-fees__row">
                <span>{t('examFee')}</span>
                <span>{formatMoney(examFeeCharge.amountDue)}</span>
                <span>{t('dueNow')}</span>
                <button
                  type="button"
                  className={`portal-btn portal-btn--secondary ${selectedChargeType === 'exam_fee' ? 'is-selected' : ''}`}
                  onClick={() => onSelectChargeType('exam_fee')}
                >
                  {t('payNow')}
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
              {t('lateFee')}
            </h2>
          </header>
          <dl className="portal-finance-checkout-summary">
            <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
              <dt>{t('lateFee')}</dt>
              <dd>{formatMoney(lateFeeCharge.amountDue)}</dd>
            </div>
          </dl>
          <p className="portal-finance-payment-option__note">
            {t('lateFeeAppliedBecauseDeadlineMissed')}
          </p>
          <p className="portal-finance-payment-option__note">
            {t('lateFeeThirtyApplied')}
            {paymentDeadline
              ? ` ${t('paymentDeadlineLabel').replace('{date}', paymentDeadline)}`
              : ''}
          </p>
          <button
            type="button"
            className={`portal-btn portal-btn--secondary ${selectedChargeType === 'late_fee' ? 'is-selected' : ''}`}
            onClick={() => onSelectChargeType('late_fee')}
          >
            {t('payNow')}
          </button>
        </section>
      ) : null}
    </div>
  )
}
