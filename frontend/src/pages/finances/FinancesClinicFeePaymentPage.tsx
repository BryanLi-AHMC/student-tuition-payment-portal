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
  fetchAuthorizeClinicFeeSummary,
  postAuthorizeNetClinicFeeCharge,
  type ClinicFeeBillingSummaryResponse,
} from '@/lib/api'
import { formatMoney } from '@/lib/formatMoney'

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

function clinicStatusMessage(summary: ClinicFeeBillingSummaryResponse | null): string {
  if (summary == null) return ''
  if (summary.clinicFeeStatus === 'paid') return 'Clinic fee is paid.'
  if (summary.clinicFeeStatus === 'registration_cancelled') {
    return 'Clinic fee deadline was missed and registration was cancelled with roster return.'
  }
  if (summary.clinicFeeStatus === 'expired') {
    return 'Clinic fee deadline has passed. Existing registration cancellation workflow is in progress.'
  }
  return 'Clinic fee is pending payment.'
}

export function FinancesClinicFeePaymentPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { account, currentStudentId, authToken, isAuthenticated } = useAccount()
  const [term, setTerm] = useState(() => searchParams.get('term')?.trim() ?? '')
  const [year, setYear] = useState(() => Number(searchParams.get('year') ?? NaN))
  const [termLabel, setTermLabel] = useState(() => searchParams.get('label')?.trim() ?? '')
  const [billingSummary, setBillingSummary] = useState<ClinicFeeBillingSummaryResponse | null>(null)
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
  const clinicDue = Math.max(0, billingSummary?.clinicFeeCharge.amountDue ?? 0)

  const amountNum = useMemo(() => {
    const n = Number(amount)
    return Number.isFinite(n) ? roundMoney(n) : Number.NaN
  }, [amount])

  const studentName = account.student.name?.trim() || 'Student'
  const displayStudentId = account.student.studentId?.trim() || studentId || '—'
  const displayTerm = termLabel || portalTermLabel(account) || 'Selected term'
  const termCode = termCodeFromQuarter(term, year)
  const statusMessage = clinicStatusMessage(billingSummary)
  const canPay = billingSummary?.clinicFeeStatus === 'pending' && clinicDue > 0

  useEffect(() => {
    setAmount(clinicDue.toFixed(2))
  }, [clinicDue])

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

        const summary = await fetchAuthorizeClinicFeeSummary(nextTerm, nextYear, {
          signal: ac.signal,
          authToken: authToken?.trim() || undefined,
        })
        if (ac.signal.aborted) return
        setBillingSummary(summary)
        if (nextLabel.trim() === '') {
          setTermLabel(`${summary.term} ${summary.year}`.trim())
        }
      } catch (e) {
        if (ac.signal.aborted) return
        setError(e instanceof Error ? e.message : 'Unable to load clinic fee details.')
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
    if (!canPay) {
      setError('Clinic fee is not currently payable from this page.')
      setCvv('')
      return
    }
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError('Enter a valid payment amount greater than 0.')
      setCvv('')
      return
    }
    if (amountNum !== clinicDue) {
      setError('Clinic fee payment amount must match the full amount due.')
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
      const result = await postAuthorizeNetClinicFeeCharge(
        {
          term: termCode,
          amount: amountNum.toFixed(2),
          chargeType: 'clinic_fee',
          paymentPlan: 'full',
          installmentCount: 1,
          opaqueData,
        },
        { authToken: authToken?.trim() || undefined },
      )
      setCvv('')
      const successText = `Clinic fee payment of ${formatMoney(Number(result.amount))} posted successfully. Ref ${result.providerTransactionId}.`
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
          Pay Clinic Fee
        </h2>
      </header>

      {loading ? (
        <p className="portal-inline-note portal-inline-note--flush" role="status">
          Loading clinic fee details...
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
            <section className="portal-card portal-finance-payment-option" aria-labelledby="clinic-fee-heading">
              <header className="portal-finance-payment-option__header">
                <h2 id="clinic-fee-heading" className="portal-section-heading">
                  Clinic Fee
                </h2>
              </header>
              <dl className="portal-finance-checkout-summary">
                <div className="portal-finance-checkout-summary__row">
                  <dt>Clinic fee amount</dt>
                  <dd>{formatMoney(billingSummary.clinicFeeCharge.amount)}</dd>
                </div>
                <div className="portal-finance-checkout-summary__row">
                  <dt>Clinic fee due now</dt>
                  <dd>{formatMoney(clinicDue)}</dd>
                </div>
                <div className="portal-finance-checkout-summary__row">
                  <dt>Status</dt>
                  <dd>{billingSummary.clinicFeeStatus.replace(/_/g, ' ')}</dd>
                </div>
                <div className="portal-finance-checkout-summary__row">
                  <dt>Required deadline</dt>
                  <dd>{billingSummary.paymentDeadline ?? 'Not set'}</dd>
                </div>
              </dl>
              <p className="portal-finance-payment-option__note">{statusMessage}</p>
              <p className="portal-finance-payment-option__note">
                Clinic fee supports one payment option only: full payment.
              </p>
            </section>
          ) : null}
          {!canPay ? (
            <p className="portal-inline-note portal-inline-note--flush" role="status">
              Clinic fee is not currently due for payment.
            </p>
          ) : null}
          <div className="portal-finance-checkout-layout">
            <div className="portal-finance-checkout-layout__col">
              <PaymentSummaryCard
                studentName={studentName}
                studentId={displayStudentId}
                termLabel={displayTerm}
                balanceDue={clinicDue}
                amountToPay={Number.isFinite(amountNum) ? amountNum : 0}
              />
            </div>
            {canPay ? (
              <div className="portal-finance-checkout-layout__col">
                <PaymentCardForm
                  amount={amount}
                  cardNumber={cardNumber}
                  expirationDate={expirationDate}
                  cvv={cvv}
                  allowPartialPayment={false}
                  lockedAmountNote="Clinic fee must be paid in one full payment."
                  submitLabel="Pay Clinic Fee"
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
            ) : null}
          </div>
        </>
      ) : null}
    </main>
  )
}
