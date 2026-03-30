import { useState } from 'react'
import { PageLayout } from '../components/PageLayout'

export function MakePaymentPage() {
  const [paymentOption, setPaymentOption] = useState<'full-balance' | 'installment'>('full-balance')
  const [paymentMethod, setPaymentMethod] = useState<'ach' | 'credit-card'>('ach')

  const isFullBalance = paymentOption === 'full-balance'
  const isCreditCard = paymentMethod === 'credit-card'

  return (
    <PageLayout title="Make a Payment">
      <main className="portal-page">
        <p className="portal-page-lede">
          Review the payment amount before you continue. This screen is a static preview only; no
          payment will be submitted or processed.
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
            >
              Use Installment Plan
            </button>
          </div>
        </section>

        <section className="portal-card portal-stack" aria-labelledby="payment-summary-heading">
          <h2 id="payment-summary-heading" className="portal-section-heading">
            Payment summary
          </h2>
          <dl>
            {isFullBalance ? (
              <>
                <div className="portal-row">
                  <dt>Current Term Charges</dt>
                  <dd>$18,200.00</dd>
                </div>
                <div className="portal-row">
                  <dt>Late Fee</dt>
                  <dd
                    style={{
                      color: '#9a3a3a',
                      fontWeight: 500,
                    }}
                  >
                    $200.00
                  </dd>
                </div>
                <div className="portal-row">
                  <dt>Current Outstanding Balance</dt>
                  <dd>$18,400.00</dd>
                </div>
                <div className="portal-row">
                  <dt>Selected Payment Amount</dt>
                  <dd>$18,400.00</dd>
                </div>
                <div className="portal-row">
                  <dt>Payment Method</dt>
                  <dd>{isCreditCard ? 'Credit card — Visa ending in 4242' : 'ACH / Bank Transfer'}</dd>
                </div>
                {isCreditCard ? (
                  <div className="portal-row">
                    <dt>Convenience Fee</dt>
                    <dd>$524.40 (2.85% for credit card payments)</dd>
                  </div>
                ) : null}
                <div className="portal-row portal-payment-total">
                  <dt>Total Due Today</dt>
                  <dd>{isCreditCard ? '$18,924.40' : '$18,400.00'}</dd>
                </div>
              </>
            ) : (
              <>
                <div className="portal-row">
                  <dt>Current Installment Due</dt>
                  <dd>$4,612.50</dd>
                </div>
                <div className="portal-row">
                  <dt>Late Fee</dt>
                  <dd
                    style={{
                      color: '#9a3a3a',
                      fontWeight: 500,
                    }}
                  >
                    $200.00
                  </dd>
                </div>
                <div className="portal-row">
                  <dt>Selected Payment Amount</dt>
                  <dd>$4,812.50</dd>
                </div>
                <div className="portal-row">
                  <dt>Payment Method</dt>
                  <dd>{isCreditCard ? 'Credit card — Visa ending in 4242' : 'ACH / Bank Transfer'}</dd>
                </div>
                {isCreditCard ? (
                  <div className="portal-row">
                    <dt>Convenience Fee</dt>
                    <dd>$137.16 (2.85% for credit card payments)</dd>
                  </div>
                ) : null}
                <div className="portal-row portal-payment-total">
                  <dt>Total Due Today</dt>
                  <dd>{isCreditCard ? '$4,949.66' : '$4,812.50'}</dd>
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
          ACH (bank transfer) payments may not incur a convenience fee. Card payments may
          include a fee as shown above, in line with bursar policy.
        </p>
      </main>
    </PageLayout>
  )
}
