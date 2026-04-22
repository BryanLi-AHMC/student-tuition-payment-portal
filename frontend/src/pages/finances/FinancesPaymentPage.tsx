import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAccount } from '@/context/AccountContext'
import { PaymentCardForm } from '@/components/finance/PaymentCardForm'
import { PaymentSummaryCard } from '@/components/finance/PaymentSummaryCard'
import { portalTermLabel } from '@/lib/accountDisplay'
import { dispatchAcceptData, loadAcceptJs } from '@/lib/authorizeNet'
import {
  fetchAccountingQuarters,
  fetchAuthorizeTuitionSummary,
  postAuthorizeNetTuitionCharge,
  type TuitionBillingSummaryResponse,
} from '@/lib/api'
import { formatMoney } from '@/lib/formatMoney'
import { calculateInstallmentSchedule, type PaymentPlan } from '@/lib/paymentPlan'

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100
}

function normalizeAmountInput(v: string): string {
  const trimmed = v.trim()
  if (trimmed === '') return ''
  const normalized = trimmed.replace(/[^0-9.]/g, '')
  const parts = normalized.split('.')
  if (parts.length <= 1) return normalized
  return `${parts[0]}.${parts.slice(1).join('').slice(0, 2)}`
}

function normalizeExpirationInput(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function splitExpirationDate(expirationDate: string): { month: string; year: string } | null {
  const match = expirationDate.match(/^(\d{2})\/(\d{2})$/)
  if (match == null) return null
  const [, month, shortYear] = match
  const monthNumber = Number(month)
  if (!Number.isFinite(monthNumber) || monthNumber < 1 || monthNumber > 12) return null
  return {
    month,
    year: `20${shortYear}`,
  }
}

function termCodeFromQuarter(term: string, year: number): string {
  const upper = term.trim().toUpperCase()
  const suffix =
    upper.startsWith('SPR') ? 'SPR'
    : upper.startsWith('SUM') ? 'SUM'
    : upper.startsWith('FAL') ? 'FAL'
    : upper.startsWith('WIN') ? 'WIN'
    : upper.slice(0, 3) || 'TRM'
  return `${year}-${suffix}`
}

function installmentOrdinal(n: number): string {
  if (n === 1) return '1st'
  if (n === 2) return '2nd'
  if (n === 3) return '3rd'
  return `${n}th`
}

export function FinancesPaymentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { account, currentStudentId, authToken, isAuthenticated } = useAccount()
  const [term, setTerm] = useState(() => searchParams.get('term')?.trim() ?? '')
  const [year, setYear] = useState(() => Number(searchParams.get('year') ?? NaN))
  const [termLabel, setTermLabel] = useState(() => searchParams.get('label')?.trim() ?? '')
  const [billingSummary, setBillingSummary] = useState<TuitionBillingSummaryResponse | null>(null)
  const [selectedChargeType, setSelectedChargeType] = useState<'tuition' | 'late_fee'>('tuition')
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('full')
  const [amount, setAmount] = useState('0.00')
  const [cardNumber, setCardNumber] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [scriptReady, setScriptReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const studentId = currentStudentId?.trim() ?? ''
  const installmentCount = 3
  const serviceFeePerInstallment = 15
  const installmentEligible = selectedChargeType === 'tuition'
  const selectedChargeDue = Math.max(
    0,
    selectedChargeType === 'tuition'
      ? billingSummary?.tuitionCharge.amountDue ?? 0
      : billingSummary?.lateFeeCharge.amountDue ?? 0,
  )
  const tuitionDue = Math.max(0, billingSummary?.tuitionCharge.amountDue ?? 0)

  const amountNum = useMemo(() => {
    const n = Number(amount)
    return Number.isFinite(n) ? roundMoney(n) : Number.NaN
  }, [amount])

  const scheduleTotals = useMemo(
    () => calculateInstallmentSchedule(tuitionDue, installmentCount, serviceFeePerInstallment),
    [tuitionDue],
  )
  const amountDueToday = useMemo(() => {
    if (!installmentEligible || paymentPlan === 'full') return roundMoney(selectedChargeDue)
    return roundMoney(scheduleTotals.schedule[0]?.totalDue ?? 0)
  }, [installmentEligible, paymentPlan, scheduleTotals.schedule, selectedChargeDue])
  const submitLabel = useMemo(() => {
    if (selectedChargeType === 'late_fee') return 'Pay Late Fee'
    return paymentPlan === 'installment'
      ? 'Continue to Installment Payment'
      : 'Continue to Full Payment'
  }, [paymentPlan, selectedChargeType])
  const lockedAmountNote = useMemo(() => {
    if (selectedChargeType === 'late_fee') {
      return 'Amount is fixed for the tuition late fee and is due now.'
    }
    return paymentPlan === 'installment'
      ? 'Amount reflects your first installment plus service fee.'
      : 'Amount reflects the full tuition payment amount.'
  }, [paymentPlan, selectedChargeType])

  const studentName = account.student.name?.trim() || 'Student'
  const displayStudentId = account.student.studentId?.trim() || studentId || '—'
  const displayTerm = termLabel || portalTermLabel(account) || 'Selected term'
  const termCode = termCodeFromQuarter(term, year)

  useEffect(() => {
    if (!installmentEligible && paymentPlan !== 'full') {
      setPaymentPlan('full')
    }
  }, [installmentEligible, paymentPlan])

  useEffect(() => {
    setAmount(amountDueToday.toFixed(2))
  }, [amountDueToday])

  useEffect(() => {
    if (!isAuthenticated || studentId === '') {
      navigate('/finances/overview', { replace: true })
      return
    }

    const ac = new AbortController()
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        let nextTerm = term
        let nextYear = year
        let nextLabel = termLabel
        if (nextTerm === '' || !Number.isFinite(nextYear) || nextYear <= 0) {
          const quartersRes = await fetchAccountingQuarters(studentId, { signal: ac.signal })
          if (ac.signal.aborted) return
          const newest = quartersRes.quarters[0]
          if (newest == null) {
            throw new Error('No payable term found for this account.')
          }
          nextTerm = newest.term
          nextYear = newest.year
          nextLabel = newest.label
          setTerm(nextTerm)
          setYear(nextYear)
          setTermLabel(nextLabel)
        }

        const summary = await fetchAuthorizeTuitionSummary(nextTerm, nextYear, {
          signal: ac.signal,
          authToken: authToken?.trim() || undefined,
        })
        if (ac.signal.aborted) return
        setBillingSummary(summary)
        setSelectedChargeType(
          summary.tuitionCharge.amountDue > 0
            ? 'tuition'
            : summary.lateFeeCharge.amountDue > 0
              ? 'late_fee'
              : 'tuition',
        )
        if (nextLabel.trim() === '') {
          setTermLabel(`${summary.term} ${summary.year}`.trim())
        }
      } catch (e) {
        if (ac.signal.aborted) return
        setError(e instanceof Error ? e.message : 'Unable to load payment details.')
      } finally {
        if (!ac.signal.aborted) setLoading(false)
      }
    })()

    return () => ac.abort()
  }, [authToken, isAuthenticated, navigate, studentId, term, termLabel, year])

  useEffect(() => {
    let mounted = true
    setScriptReady(false)
    void loadAcceptJs()
      .then(() => {
        if (!mounted) return
        setScriptReady(true)
      })
      .catch((e) => {
        if (!mounted) return
        setError(e instanceof Error ? e.message : 'Unable to load payment script.')
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting || loading) return

    const apiLoginId = String(import.meta.env.VITE_AUTHORIZE_API_LOGIN_ID ?? '').trim()
    const clientKey = String(import.meta.env.VITE_AUTHORIZE_CLIENT_KEY ?? '').trim()

    if (apiLoginId === '' || clientKey === '') {
      setError('Payment configuration is unavailable. Please contact support.')
      setCvv('')
      return
    }
    if (!scriptReady) {
      setError('Secure payment form is still loading. Please wait a moment and try again.')
      setCvv('')
      return
    }
    if (term.trim() === '' || !Number.isFinite(year)) {
      setError('Billing term is unavailable. Please return to Finances and try again.')
      setCvv('')
      return
    }
    if (selectedChargeDue <= 0) {
      setError('There is no outstanding balance for the selected charge.')
      setCvv('')
      return
    }
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError('Enter a valid payment amount greater than 0.')
      setCvv('')
      return
    }
    const maxAllowedAmount = roundMoney(
      selectedChargeType === 'tuition' && paymentPlan === 'installment'
        ? selectedChargeDue + serviceFeePerInstallment
        : selectedChargeDue,
    )
    if (amountNum > maxAllowedAmount) {
      setError('Payment amount cannot exceed the amount due for this charge.')
      setCvv('')
      return
    }
    if (!/^\d{13,19}$/.test(cardNumber)) {
      setError('Card number must be 13 to 19 digits.')
      setCvv('')
      return
    }
    const expirationParts = splitExpirationDate(expirationDate)
    if (expirationParts == null) {
      setError('Expiration date must be in MM/YY format.')
      setCvv('')
      return
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError('CVV must be 3 or 4 digits.')
      setCvv('')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const opaqueData = await dispatchAcceptData({
        authData: { apiLoginID: apiLoginId, clientKey },
        cardData: {
          cardNumber,
          month: expirationParts.month,
          year: expirationParts.year,
          cardCode: cvv,
        },
      })
      const result = await postAuthorizeNetTuitionCharge(
        {
          term: termCode,
          amount: amountNum.toFixed(2),
          chargeType: selectedChargeType,
          paymentPlan: selectedChargeType === 'tuition' ? paymentPlan : 'full',
          installmentCount:
            selectedChargeType === 'tuition' && paymentPlan === 'installment' ? installmentCount : 1,
          opaqueData,
        },
        { authToken: authToken?.trim() || undefined },
      )
      setCvv('')
      const successText = `Payment of ${formatMoney(Number(result.amount))} posted successfully. Ref ${result.providerTransactionId}.`
      setSuccessMessage(successText)
      window.setTimeout(() => {
        navigate('/finances/overview', {
          replace: true,
          state: {
            financePaymentToast: successText,
            financePaymentRefresh: true,
          },
        })
      }, 900)
    } catch (e) {
      setCvv('')
      setError(e instanceof Error ? e.message : 'Payment could not be processed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="portal-page portal-finance-checkout-page">
      <header className="portal-finance-checkout-page__header">
        <Link to="/finances/overview" className="portal-finance-checkout-page__back-link">
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Back to Finances</span>
        </Link>
        <h2 className="portal-page-title portal-finance-checkout-page__title">
          Pay Tuition
        </h2>
      </header>

      {loading ? (
        <p className="portal-inline-note portal-inline-note--flush" role="status">
          Loading payment details...
        </p>
      ) : null}

      {successMessage ? (
        <p className="portal-inline-note portal-inline-note--flush portal-finance-checkout-page__success" role="status">
          {successMessage}
        </p>
      ) : null}

      {!loading ? (
        <>
          {billingSummary != null ? (
            <section className="portal-card portal-finance-payment-option" aria-labelledby="tuition-flow-heading">
              <header className="portal-finance-payment-option__header">
                <h2 id="tuition-flow-heading" className="portal-section-heading">
                  Tuition Payment
                </h2>
              </header>
              <dl className="portal-finance-checkout-summary">
                <div className="portal-finance-checkout-summary__row">
                  <dt>Total tuition charge</dt>
                  <dd>{formatMoney(billingSummary.tuitionCharge.amount)}</dd>
                </div>
                <div className="portal-finance-checkout-summary__row">
                  <dt>Tuition due</dt>
                  <dd>{formatMoney(billingSummary.tuitionCharge.amountDue)}</dd>
                </div>
                <div className="portal-finance-checkout-summary__row">
                  <dt>Exam fee due</dt>
                  <dd>{formatMoney(billingSummary.examFeeCharge.amountDue)}</dd>
                </div>
                <div className="portal-finance-checkout-summary__row">
                  <dt>Tuition late fee due</dt>
                  <dd>{formatMoney(billingSummary.lateFeeCharge.amountDue)}</dd>
                </div>
                <div className="portal-finance-checkout-summary__row portal-finance-checkout-summary__row--strong">
                  <dt>Tuition flow due</dt>
                  <dd>{formatMoney(billingSummary.tuitionTotalDue)}</dd>
                </div>
              </dl>
              <div className="portal-finance-payment-option__cards" role="radiogroup" aria-label="Tuition charge type">
                <button
                  type="button"
                  className={`portal-finance-payment-option__card ${selectedChargeType === 'tuition' ? 'is-selected' : ''}`}
                  onClick={() => setSelectedChargeType('tuition')}
                  disabled={billingSummary.tuitionCharge.amountDue <= 0}
                >
                  <span className="portal-finance-payment-option__card-content">
                    <span className="portal-finance-payment-option__card-title">Pay Tuition</span>
                    <span className="portal-finance-payment-option__card-copy">
                      Tuition supports full payment or installment payment.
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className={`portal-finance-payment-option__card ${selectedChargeType === 'late_fee' ? 'is-selected' : ''}`}
                  onClick={() => setSelectedChargeType('late_fee')}
                  disabled={billingSummary.lateFeeCharge.amountDue <= 0}
                >
                  <span className="portal-finance-payment-option__card-content">
                    <span className="portal-finance-payment-option__card-title">Pay Tuition Late Fee</span>
                    <span className="portal-finance-payment-option__card-copy">
                      Late fee applies to tuition only and must be paid in full.
                    </span>
                  </span>
                </button>
              </div>
              {selectedChargeType === 'tuition' ? (
                <>
                  <div className="portal-finance-payment-option__cards" role="radiogroup" aria-label="Tuition payment option">
                    <button
                      type="button"
                      className={`portal-finance-payment-option__card ${paymentPlan === 'full' ? 'is-selected' : ''}`}
                      onClick={() => setPaymentPlan('full')}
                    >
                      <span className="portal-finance-payment-option__card-content">
                        <span className="portal-finance-payment-option__card-title">Pay in Full</span>
                        <span className="portal-finance-payment-option__card-copy">
                          Pay all unpaid tuition in one payment.
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className={`portal-finance-payment-option__card ${paymentPlan === 'installment' ? 'is-selected' : ''}`}
                      onClick={() => setPaymentPlan('installment')}
                      disabled={billingSummary.tuitionCharge.amountDue <= 0}
                    >
                      <span className="portal-finance-payment-option__card-content">
                        <span className="portal-finance-payment-option__card-title">Pay by Installments</span>
                        <span className="portal-finance-payment-option__card-copy">
                          3 installments with a $15 fee each installment.
                        </span>
                      </span>
                    </button>
                  </div>
                  {paymentPlan === 'installment' ? (
                    <section className="portal-finance-installment-schedule" aria-labelledby="tuition-installment-schedule-heading">
                      <h3 id="tuition-installment-schedule-heading" className="portal-section-heading">
                        Installment Schedule
                      </h3>
                      <ul className="portal-finance-installment-schedule__list">
                        {scheduleTotals.schedule.map((row) => (
                          <li key={row.installmentNumber}>
                            {installmentOrdinal(row.installmentNumber)} installment: {formatMoney(row.tuitionAmount)} +{' '}
                            {formatMoney(row.serviceFee)} service fee
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </>
              ) : null}
            </section>
          ) : null}
          {billingSummary != null && billingSummary.tuitionTotalDue <= 0 ? (
            <p className="portal-inline-note portal-inline-note--flush" role="status">
              Tuition and tuition late fee are fully paid for this term.
            </p>
          ) : null}
          <div className="portal-finance-checkout-layout">
            <div className="portal-finance-checkout-layout__col">
              <PaymentSummaryCard
                studentName={studentName}
                studentId={displayStudentId}
                termLabel={displayTerm}
                balanceDue={selectedChargeDue}
                amountToPay={Number.isFinite(amountNum) ? amountNum : 0}
              />
            </div>
            <div className="portal-finance-checkout-layout__col">
              <PaymentCardForm
                amount={amount}
                cardNumber={cardNumber}
                expirationDate={expirationDate}
                cvv={cvv}
                allowPartialPayment={false}
                lockedAmountNote={lockedAmountNote}
                submitLabel={submitLabel}
                busy={submitting}
                scriptReady={scriptReady}
                error={error}
                onAmountChange={(next) => setAmount(normalizeAmountInput(next))}
                onCardNumberChange={(next) => setCardNumber(next.replace(/\D/g, ''))}
                onExpirationDateChange={(next) => setExpirationDate(normalizeExpirationInput(next))}
                onCvvChange={(next) => setCvv(next.replace(/\D/g, ''))}
                onSubmit={(event) => void handleSubmit(event)}
                onCancel={() => navigate('/finances/overview')}
              />
            </div>
          </div>
        </>
      ) : null}
    </main>
  )
}
