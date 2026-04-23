import { formatMoney } from '@/lib/formatMoney'
import { useStudentPortalT } from '@/LanguageContext'

export type PaymentBreakdownLine = {
  key: string
  label: string
  amount: number
}

type PaymentSummaryCardProps = {
  studentName: string
  studentId: string
  termLabel: string
  balanceDue: number
  breakdownLines: PaymentBreakdownLine[]
  creditCardFee: number
  /** Total charged to the card (base + fee). */
  totalCharged: number
  cardFundingNote?: string | null
}

export function PaymentSummaryCard({
  studentName,
  studentId,
  termLabel,
  balanceDue,
  breakdownLines,
  creditCardFee,
  totalCharged,
  cardFundingNote,
}: PaymentSummaryCardProps) {
  const t = useStudentPortalT()

  return (
    <section className="portal-card portal-finance-checkout-card" aria-labelledby="payment-summary-title">
      <header className="portal-finance-checkout-card__header">
        <h2 id="payment-summary-title" className="portal-section-heading">
          {t('paymentSummaryCardTitle')}
        </h2>
      </header>
      <dl className="portal-finance-checkout-summary">
        <div className="portal-finance-checkout-summary__row">
          <dt>{t('paymentSummaryStudent')}</dt>
          <dd>{studentName}</dd>
        </div>
        <div className="portal-finance-checkout-summary__row">
          <dt>{t('paymentSummaryStudentId')}</dt>
          <dd>{studentId}</dd>
        </div>
        <div className="portal-finance-checkout-summary__row">
          <dt>{t('paymentSummaryTerm')}</dt>
          <dd>{termLabel}</dd>
        </div>
        <div className="portal-finance-checkout-summary__row">
          <dt>{t('paymentSummaryBalanceDue')}</dt>
          <dd>{formatMoney(balanceDue)}</dd>
        </div>
        {breakdownLines.map((row) => (
          <div key={row.key} className="portal-finance-checkout-summary__row">
            <dt>{row.label}</dt>
            <dd>{formatMoney(row.amount)}</dd>
          </div>
        ))}
        {creditCardFee > 0 ? (
          <div className="portal-finance-checkout-summary__row">
            <dt>{t('creditCardProcessingFeeLabel')}</dt>
            <dd>{formatMoney(creditCardFee)}</dd>
          </div>
        ) : null}
        <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
          <dt>{t('paymentSummaryTotalCharged')}</dt>
          <dd>{formatMoney(totalCharged)}</dd>
        </div>
      </dl>
      {cardFundingNote != null && cardFundingNote.trim() !== '' ? (
        <p className="portal-finance-checkout-form__helper portal-finance-checkout-summary__funding-note" role="status">
          {cardFundingNote}
        </p>
      ) : null}
    </section>
  )
}
