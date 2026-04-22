import { formatMoney } from '@/lib/formatMoney'
import { useStudentPortalT } from '@/LanguageContext'

type PaymentSummaryCardProps = {
  studentName: string
  studentId: string
  termLabel: string
  balanceDue: number
  amountToPay: number
}

export function PaymentSummaryCard({
  studentName,
  studentId,
  termLabel,
  balanceDue,
  amountToPay,
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
        <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
          <dt>{t('paymentSummaryAmountToPay')}</dt>
          <dd>{formatMoney(amountToPay)}</dd>
        </div>
      </dl>
    </section>
  )
}
