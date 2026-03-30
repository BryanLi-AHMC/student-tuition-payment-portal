import { useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { useAccount } from '../context/AccountContext'
import { CARD_CONVENIENCE_RATE } from '../lib/api'
import {
  lateFeeFromLineItems,
  nextInstallmentRow,
  portalTermLabel,
  toInstallmentRows,
} from '../lib/accountDisplay'
import { formatMoney } from '../lib/formatMoney'

function roundMoney(n: number) {
  return Math.round(n * 100) / 100
}

export function MakePaymentPage() {
  const { account } = useAccount()
  const [paymentOption, setPaymentOption] = useState<'full-balance' | 'installment'>('full-balance')
  const [paymentMethod, setPaymentMethod] = useState<'ach' | 'credit-card'>('ach')

  const isFullBalance = paymentOption === 'full-balance'
  const isCreditCard = paymentMethod === 'credit-card'

  const { summary, lineItems, installmentPlan } = account
  const installmentRows = toInstallmentRows(installmentPlan.schedule)
  const lateFee = lateFeeFromLineItems(lineItems)
  const nextDue = nextInstallmentRow(installmentRows)

  const fullSelected = summary.outstandingBalance
  const installmentSelected = nextDue?.amount ?? 0
  const basePayToday = isFullBalance ? fullSelected : installmentSelected
  const convenienceFee = isCreditCard ? roundMoney(basePayToday * CARD_CONVENIENCE_RATE) : 0
  const totalDueToday = roundMoney(basePayToday + convenienceFee)

  const termLabel = portalTermLabel(account)

  return (
    <PageLayout>
      <main className="portal-page">
        <p className="portal-page-lede">
          Review the payment amount before you continue. Amounts come from your {termLabel} MAHM account
          (catalog rates and posted charges). This screen is a static preview only; no payment will be
          submitted or processed.
        </p>

        <section className="portal-card portal-stack" aria-labelledby="payment-option-heading">
          <h2 id="payment-option-heading" className="portal-section-heading">
            Payment Option
          </h2>
          <div className="portal-actions">
            <button
              type="button"
              className={`portal-btn ${isFullBalance ? 'portal-btn--primary' : 'portal-btn--secondary'}`}
              onClick={() => setPaymentOption('full-balance')}
              aria-pressed={isFullBalance}
            >
              Pay Full Balance
            </button>
            <button
              type="button"
              className={`portal-btn ${!isFullBalance ? 'portal-btn--primary' : 'portal-btn--secondary'}`}
              onClick={() => setPaymentOption('installment')}
              aria-pressed={!isFullBalance}
              disabled={!installmentPlan.enabled}
            >
              Use Installment Plan
            </button>
          </div>
          {!installmentPlan.enabled ? (
            <p className="portal-inline-note">
              You are not on a term installment plan; pay full balance or contact the bursar to change
              your billing preference.
            </p>
          ) : null}
        </section>

        <section className="portal-card portal-stack" aria-labelledby="payment-summary-heading">
          <h2 id="payment-summary-heading" className="portal-section-heading">
            Payment summary
          </h2>
          <dl>
            {isFullBalance ? (
              <>
                <div className="portal-row">
                  <dt>Total charges (term)</dt>
                  <dd>{formatMoney(summary.totalCharges)}</dd>
                </div>
                <div className="portal-row">
                  <dt>Payments &amp; credits</dt>
                  <dd>{formatMoney(summary.payments)}</dd>
                </div>
                {lateFee > 0 ? (
                  <div className="portal-row portal-row--fee-warning">
                    <dt>Late fee</dt>
                    <dd>{formatMoney(lateFee)}</dd>
                  </div>
                ) : null}
                <div className="portal-row">
                  <dt>Current outstanding balance</dt>
                  <dd>{formatMoney(summary.outstandingBalance)}</dd>
                </div>
                <div className="portal-row">
                  <dt>Selected payment amount</dt>
                  <dd>{formatMoney(fullSelected)}</dd>
                </div>
                <div className="portal-row">
                  <dt>Payment method</dt>
                  <dd>{isCreditCard ? 'Credit card — Visa ending in 4242' : 'ACH / Bank Transfer'}</dd>
                </div>
                {isCreditCard ? (
                  <div className="portal-row">
                    <dt>Convenience fee</dt>
                    <dd>
                      {formatMoney(convenienceFee)} ({(CARD_CONVENIENCE_RATE * 100).toFixed(2)}% for credit
                      card payments)
                    </dd>
                  </div>
                ) : null}
                <div className="portal-row portal-payment-total">
                  <dt>Total due today</dt>
                  <dd>{formatMoney(totalDueToday)}</dd>
                </div>
              </>
            ) : (
              <>
                <div className="portal-row">
                  <dt>Current installment due</dt>
                  <dd>{nextDue ? formatMoney(nextDue.amount) : formatMoney(0)}</dd>
                </div>
                <div className="portal-row">
                  <dt>Selected payment amount</dt>
                  <dd>{formatMoney(installmentSelected)}</dd>
                </div>
                <div className="portal-row">
                  <dt>Payment method</dt>
                  <dd>{isCreditCard ? 'Credit card — Visa ending in 4242' : 'ACH / Bank Transfer'}</dd>
                </div>
                {isCreditCard ? (
                  <div className="portal-row">
                    <dt>Convenience fee</dt>
                    <dd>
                      {formatMoney(convenienceFee)} ({(CARD_CONVENIENCE_RATE * 100).toFixed(2)}% for credit
                      card payments)
                    </dd>
                  </div>
                ) : null}
                <div className="portal-row portal-payment-total">
                  <dt>Total due today</dt>
                  <dd>{formatMoney(totalDueToday)}</dd>
                </div>
              </>
            )}
          </dl>
        </section>

        <section className="portal-card portal-stack" aria-labelledby="payment-method-heading">
          <h2 id="payment-method-heading" className="portal-section-heading">
            Payment Method
          </h2>
          <div className="portal-actions">
            <button
              type="button"
              className={`portal-btn ${!isCreditCard ? 'portal-btn--primary' : 'portal-btn--secondary'}`}
              onClick={() => setPaymentMethod('ach')}
              aria-pressed={!isCreditCard}
            >
              ACH / Bank Transfer
            </button>
            <button
              type="button"
              className={`portal-btn ${isCreditCard ? 'portal-btn--primary' : 'portal-btn--secondary'}`}
              onClick={() => setPaymentMethod('credit-card')}
              aria-pressed={isCreditCard}
            >
              Credit Card
            </button>
          </div>
        </section>

        <p className="portal-inline-note">
          ACH (bank transfer) payments may not incur a convenience fee. Card payments may include a fee
          as shown above, in line with bursar policy.
        </p>
      </main>
    </PageLayout>
  )
}
