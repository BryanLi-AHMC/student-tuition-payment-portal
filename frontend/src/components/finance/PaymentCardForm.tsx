import type { FormEvent } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'

type PaymentCardFormProps = {
  amount: string
  cardNumber: string
  expirationDate: string
  cvv: string
  allowPartialPayment: boolean
  lockedAmountNote?: string | null
  submitLabel?: string
  busy: boolean
  scriptReady: boolean
  error: string | null
  onAmountChange: (next: string) => void
  onCardNumberChange: (next: string) => void
  onExpirationDateChange: (next: string) => void
  onCvvChange: (next: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function PaymentCardForm({
  amount,
  cardNumber,
  expirationDate,
  cvv,
  allowPartialPayment,
  lockedAmountNote,
  submitLabel,
  busy,
  scriptReady,
  error,
  onAmountChange,
  onCardNumberChange,
  onExpirationDateChange,
  onCvvChange,
  onSubmit,
  onCancel,
}: PaymentCardFormProps) {
  return (
    <section className="portal-card portal-finance-checkout-card" aria-labelledby="payment-form-title">
      <header className="portal-finance-checkout-card__header portal-finance-checkout-card__header--form">
        <div>
          <h2 id="payment-form-title" className="portal-section-heading">
            Card Payment
          </h2>
        </div>
      </header>

      <form className="portal-finance-checkout-form" onSubmit={onSubmit}>
        <label className="portal-finance-checkout-form__field">
          <span>Card number</span>
          <div className="portal-finance-checkout-form__input-wrap portal-finance-checkout-form__input-wrap--card-number card-input-wrapper">
            <input
              className="card-number-input"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={19}
              value={cardNumber}
              onChange={(event) => onCardNumberChange(event.target.value)}
              disabled={busy}
              required
            />
            <div className="portal-finance-checkout-form__trailing-icons card-brand-icons" aria-hidden="true">
              <img src="/visa.png" alt="" />
              <img src="/master.png" alt="" />
              <img src="/amex.png" alt="" />
              <img src="/discover.png" alt="" />
            </div>
          </div>
        </label>

        <div className="portal-finance-checkout-form__triple">
          <label className="portal-finance-checkout-form__field">
            <span>Exp. date</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
              value={expirationDate}
              onChange={(event) => onExpirationDateChange(event.target.value)}
              disabled={busy}
              required
            />
          </label>
          <label className="portal-finance-checkout-form__field">
            <span>CVV</span>
            <div className="portal-finance-checkout-form__input-wrap portal-finance-checkout-form__input-wrap--cvv card-input-wrapper">
              <input
                className="cvv-input"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="CVC"
                maxLength={4}
                value={cvv}
                onChange={(event) => onCvvChange(event.target.value)}
                disabled={busy}
                required
              />
              <div className="portal-finance-checkout-form__trailing-icon cvv-icon" aria-hidden="true">
                <img src="/CVC.png" alt="" />
              </div>
            </div>
          </label>
        </div>

        <label className="portal-finance-checkout-form__field">
          <span>Amount to pay</span>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            disabled={busy || !allowPartialPayment}
            readOnly={!allowPartialPayment}
            required
          />
        </label>

        {!allowPartialPayment ? (
          <p className="portal-finance-checkout-form__helper">
            {lockedAmountNote ?? 'Amount is fixed for this payment.'}
          </p>
        ) : null}

        <p className="portal-finance-checkout-form__trust">
          <Lock size={14} aria-hidden="true" />
          <span>Your payment information is securely transmitted to Authorize.net.</span>
        </p>

        {!scriptReady ? (
          <p className="portal-inline-note portal-inline-note--flush" role="status">
            Secure payment fields are loading...
          </p>
        ) : null}

        {error ? (
          <p className="portal-inline-note portal-inline-note--flush portal-finance-checkout-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="portal-finance-checkout-form__actions">
          <button
            type="button"
            className="portal-btn portal-btn--secondary portal-finance-checkout-form__btn"
            onClick={onCancel}
            disabled={busy}
          >
            Back
          </button>
          <button
            type="submit"
            className="portal-btn portal-btn--primary portal-finance-checkout-form__btn"
            disabled={busy || !scriptReady}
          >
            {busy ? 'Processing...' : submitLabel ?? 'Pay Now'}
          </button>
        </div>

        <p className="portal-finance-checkout-form__secure-row">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>Secure checkout</span>
        </p>
      </form>
    </section>
  )
}
