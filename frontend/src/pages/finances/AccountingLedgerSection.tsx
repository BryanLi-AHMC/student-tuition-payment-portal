import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage, useStudentPortalT } from '@/LanguageContext'
import { useAccount } from '../../context/AccountContext'
import {
  fetchAccountingLedger,
  fetchAccountingQuarters,
  fetchAuthorizeCurrentTermSummary,
  type AccountingLedgerResponse,
  type AccountingLedgerRow,
  type AccountingQuarterOption,
  type CurrentTermBillingSummaryResponse,
  type ClinicalBookingPaymentHoldLedger,
} from '../../lib/api'
import type { StudentPortalKey } from '../../lib/i18n'
import { formatMoney } from '../../lib/formatMoney'
import { useIsNarrowMobile } from '../../hooks/useMatchMedia'

function dashText(value: string): string {
  return value.trim() !== '' ? value : '—'
}

function ledgerChargeCell(debit: number): string {
  if (debit === 0) return '—'
  return formatMoney(debit)
}

function ledgerPaymentCell(credit: number): string {
  if (credit === 0) return '—'
  return formatMoney(credit)
}

function formatLedgerDate(iso: string, locale: string): string {
  if (!iso || iso.trim() === '') return '—'
  const d = new Date(`${iso.trim()}T12:00:00`)
  if (Number.isNaN(d.getTime())) return iso.trim()
  return d.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function quarterKey(q: AccountingQuarterOption): string {
  return `${q.year}:${q.term}`
}

function formatRemainingHms(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function ClinicalBookingPaymentHoldCountdown({
  hold,
  t,
}: {
  hold: ClinicalBookingPaymentHoldLedger
  t: (key: StudentPortalKey) => string
}): ReactElement | null {
  const expiresMs = useMemo(() => {
    const ms = new Date(hold.holdExpiresAt.trim()).getTime()
    return Number.isFinite(ms) ? ms : Number.NaN
  }, [hold.holdExpiresAt])

  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (!Number.isFinite(expiresMs)) return undefined
    const id = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [expiresMs])

  if (!Number.isFinite(expiresMs) || hold.holdStatus !== 'active') {
    return null
  }

  const remainingSec = Math.max(0, Math.floor((expiresMs - nowMs) / 1000))
  if (remainingSec <= 0) {
    return (
      <p className="portal-inline-note portal-inline-note--flush" role="status">
        {t('clinicalBookingPaymentHoldExpired')}
      </p>
    )
  }

  return (
    <p className="portal-inline-note portal-inline-note--flush" aria-live="polite">
      {t('clinicalBookingPaymentDueIn').replace('{time}', formatRemainingHms(remainingSec))}
    </p>
  )
}

/**
 * Quarter selector + legacy `accounting` detail table (real students only; hidden when no quarters).
 */
function AccountingLedgerMobileCards({
  ledger,
  dateLocale,
  t,
}: {
  ledger: AccountingLedgerResponse
  dateLocale: string
  t: (key: StudentPortalKey) => string
}) {
  return (
    <div className="portal-account-ledger-cards" aria-label={t('accountingLedgerByQuarter')}>
      <ul className="portal-account-ledger-cards__list">
        {ledger.rows.map((row: AccountingLedgerRow, index) => (
          <li key={`${row.date}-${index}-${row.memo}`} className="portal-account-ledger-card">
            <dl className="portal-account-ledger-card__dl">
              <div className="portal-account-ledger-card__row">
                <dt>{t('date')}</dt>
                <dd>{formatLedgerDate(row.date, dateLocale)}</dd>
              </div>
              <div className="portal-account-ledger-card__row">
                <dt>{t('type')}</dt>
                <dd className="portal-table-cell-capitalize">{dashText(row.type)}</dd>
              </div>
              <div className="portal-account-ledger-card__row">
                <dt>{t('code')}</dt>
                <dd>{dashText(row.code)}</dd>
              </div>
              <div className="portal-account-ledger-card__row portal-account-ledger-card__row--block">
                <dt>{t('description')}</dt>
                <dd>
                  <div>{dashText(row.memo)}</div>
                  {row.clinicalBookingPaymentHold != null ? (
                    <ClinicalBookingPaymentHoldCountdown hold={row.clinicalBookingPaymentHold} t={t} />
                  ) : null}
                </dd>
              </div>
              <div className="portal-account-ledger-card__row portal-account-ledger-card__row--money">
                <dt>{t('charge')}</dt>
                <dd>{ledgerChargeCell(row.debit)}</dd>
              </div>
              <div className="portal-account-ledger-card__row portal-account-ledger-card__row--money">
                <dt>{t('payment')}</dt>
                <dd>{ledgerPaymentCell(row.credit)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <div className="portal-account-ledger-cards__footer">
        <div className="portal-account-ledger-cards__footer-row">
          <span>{t('totalCharges')}</span>
          <span>{formatMoney(ledger.summary.totalCharges)}</span>
        </div>
        <div className="portal-account-ledger-cards__footer-row">
          <span>{t('totalPayments')}</span>
          <span>{formatMoney(ledger.summary.totalPayments)}</span>
        </div>
        <div className="portal-account-ledger-cards__footer-row portal-account-ledger-cards__footer-row--strong">
          <span>{t('balance')}</span>
          <span>{formatMoney(ledger.summary.balance)}</span>
        </div>
      </div>
    </div>
  )
}

export function AccountingLedgerSection() {
  const { locale } = useLanguage()
  const t = useStudentPortalT()
  const navigate = useNavigate()
  const location = useLocation()
  const narrowMobile = useIsNarrowMobile()
  const dateLocale = locale === 'zh' ? 'zh-TW' : 'en-US'
  const { currentStudentId, isAuthenticated, authToken } = useAccount()
  const [quarters, setQuarters] = useState<AccountingQuarterOption[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [ledger, setLedger] = useState<AccountingLedgerResponse | null>(null)
  const [loadingQuarters, setLoadingQuarters] = useState(false)
  const [loadingLedger, setLoadingLedger] = useState(false)
  const [loadingBillingSummary, setLoadingBillingSummary] = useState(false)
  const [billingSummary, setBillingSummary] = useState<CurrentTermBillingSummaryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ledgerReloadSeq, setLedgerReloadSeq] = useState(0)
  const [paymentToast, setPaymentToast] = useState<string | null>(null)

  const studentId = currentStudentId?.trim() ?? ''

  useEffect(() => {
    if (!isAuthenticated || studentId === '') {
      setQuarters([])
      setSelectedKey(null)
      setLedger(null)
      setError(null)
      return
    }

    const ac = new AbortController()
    setLoadingQuarters(true)
    setError(null)

    ;(async () => {
      try {
        const res = await fetchAccountingQuarters(studentId, { signal: ac.signal })
        if (ac.signal.aborted) return
        setQuarters(res.quarters)
        const newest = res.quarters[0]
        setSelectedKey(newest ? quarterKey(newest) : null)
        setLedger(null)
      } catch (e) {
        if (ac.signal.aborted) return
        setQuarters([])
        setSelectedKey(null)
        setLedger(null)
        setError(e instanceof Error ? e.message : t('couldNotLoadAccountingQuartersFallback'))
      } finally {
        if (!ac.signal.aborted) setLoadingQuarters(false)
      }
    })()

    return () => ac.abort()
  }, [isAuthenticated, studentId])

  const selectedQuarter = useMemo(() => {
    if (selectedKey == null) return null
    return quarters.find((q) => quarterKey(q) === selectedKey) ?? null
  }, [quarters, selectedKey])

  useEffect(() => {
    if (!paymentToast) return undefined
    const id = window.setTimeout(() => setPaymentToast(null), 5000)
    return () => window.clearTimeout(id)
  }, [paymentToast])

  useEffect(() => {
    const state = location.state as
      | { financePaymentToast?: string; financePaymentRefresh?: boolean }
      | null
      | undefined
    const nextToast = state?.financePaymentToast?.trim() ?? ''
    if (nextToast === '') return
    setPaymentToast(nextToast)
    if (state?.financePaymentRefresh) {
      setLedgerReloadSeq((value) => value + 1)
    }
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }, [location.pathname, location.search, location.state, navigate])

  useEffect(() => {
    if (selectedQuarter == null) {
      setBillingSummary(null)
      return
    }
    const ac = new AbortController()
    setLoadingBillingSummary(true)
    ;(async () => {
      try {
        const summary = await fetchAuthorizeCurrentTermSummary(selectedQuarter.term, selectedQuarter.year, {
          signal: ac.signal,
          authToken: authToken?.trim() || undefined,
        })
        if (!ac.signal.aborted) setBillingSummary(summary)
      } catch {
        if (!ac.signal.aborted) setBillingSummary(null)
      } finally {
        if (!ac.signal.aborted) setLoadingBillingSummary(false)
      }
    })()
    return () => ac.abort()
  }, [authToken, selectedQuarter])

  useEffect(() => {
    if (selectedQuarter == null || studentId === '') {
      setLedger(null)
      return
    }
    const ac = new AbortController()
    setLoadingLedger(true)
    setError(null)
    ;(async () => {
      try {
        const res = await fetchAccountingLedger(
          studentId,
          selectedQuarter.term,
          selectedQuarter.year,
          { signal: ac.signal },
        )
        if (!ac.signal.aborted) setLedger(res)
      } catch (e) {
        if (!ac.signal.aborted) {
          setLedger(null)
          setError(e instanceof Error ? e.message : t('couldNotLoadAccountingQuartersFallback'))
        }
      } finally {
        if (!ac.signal.aborted) setLoadingLedger(false)
      }
    })()
    return () => ac.abort()
  }, [selectedQuarter, studentId, ledgerReloadSeq])

  if (!isAuthenticated || studentId === '') {
    return null
  }

  if (loadingQuarters && quarters.length === 0) {
    return (
      <section className="portal-stack" aria-busy="true" aria-live="polite">
        <p className="portal-inline-note portal-inline-note--flush">{t('loadingAccountingQuarters')}</p>
      </section>
    )
  }

  if (!loadingQuarters && quarters.length === 0) {
    if (error) {
      return (
        <section className="portal-stack" aria-live="polite">
          <h2 className="portal-section-heading">{t('accountingLedgerByQuarter')}</h2>
          <p className="portal-inline-note portal-inline-note--flush" role="alert">
            {t('couldNotLoadAccountingQuarters')} {error}
          </p>
        </section>
      )
    }
    return null
  }

  const showMakePaymentControl = selectedQuarter != null && quarters.length > 0
  const tuitionDue = Math.max(0, billingSummary?.tuitionCharge.amountDue ?? 0)
  const clinicDue = Math.max(0, billingSummary?.clinicFeeCharge.amountDue ?? 0)
  const examDue = Math.max(0, billingSummary?.examFeeCharge.amountDue ?? 0)
  const clinicStatus = billingSummary?.clinicFeeStatus ?? (clinicDue > 0 ? 'pending' : 'paid')
  return (
    <section className="portal-stack" aria-labelledby="accounting-ledger-heading">
      <div className="portal-account-ledger__toolbar">
        <h2 id="accounting-ledger-heading" className="portal-section-heading">
          {t('accountingLedgerByQuarter')}
        </h2>
        <div className="portal-account-ledger__toolbar-actions">
          <label className="portal-account-ledger__quarter-label" htmlFor="accounting-quarter-select">
            <span className="visually-hidden">{t('quarterVisuallyHidden')}</span>
            <select
              id="accounting-quarter-select"
              className="portal-account-ledger__select"
              value={selectedKey ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setSelectedKey(v === '' ? null : v)
              }}
              disabled={loadingQuarters}
            >
              {quarters.map((q) => (
                <option key={quarterKey(q)} value={quarterKey(q)}>
                  {q.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {paymentToast ? (
        <p className="portal-finance-payment-toast" role="status" aria-live="polite">
          {paymentToast}
        </p>
      ) : null}

      {showMakePaymentControl ? (
        <section className="portal-card portal-finance-entry-actions" aria-labelledby="finance-entry-actions-heading">
          <header className="portal-finance-entry-actions__header">
            <h3 id="finance-entry-actions-heading" className="portal-section-heading">
              Payment Actions
            </h3>
            <p className="portal-finance-entry-actions__subhead">
              Tuition and clinic fee are paid in separate flows.
            </p>
          </header>
          {loadingBillingSummary ? (
            <p className="portal-inline-note portal-inline-note--flush" role="status">
              Loading payment action status...
            </p>
          ) : null}
          <div className="portal-finance-entry-actions__grid">
            <article className="portal-finance-entry-card">
              <h4 className="portal-finance-entry-card__title">Tuition</h4>
              <p className="portal-finance-entry-card__status">Due: {formatMoney(tuitionDue)}</p>
              <div className="portal-finance-entry-card__actions">
                <button
                  type="button"
                  className="portal-btn portal-btn--secondary"
                  onClick={() => {
                    if (selectedQuarter == null) return
                    const params = new URLSearchParams()
                    params.set('term', selectedQuarter.term)
                    params.set('year', String(selectedQuarter.year))
                    params.set('label', selectedQuarter.label)
                    navigate(`/finances/payment/tuition?${params.toString()}`)
                  }}
                >
                  View Tuition Balance
                </button>
                <button
                  type="button"
                  className="portal-btn portal-btn--primary"
                  onClick={() => {
                    if (selectedQuarter == null) return
                    const params = new URLSearchParams()
                    params.set('term', selectedQuarter.term)
                    params.set('year', String(selectedQuarter.year))
                    params.set('label', selectedQuarter.label)
                    navigate(`/finances/payment/tuition?${params.toString()}`)
                  }}
                  disabled={tuitionDue <= 0}
                >
                  Pay Tuition
                </button>
              </div>
            </article>

            <article className="portal-finance-entry-card">
              <h4 className="portal-finance-entry-card__title">Clinic Fee</h4>
              <p className="portal-finance-entry-card__status">
                Status:{' '}
                {clinicStatus === 'registration_cancelled'
                  ? 'registration cancelled'
                  : clinicStatus === 'expired'
                    ? 'expired'
                    : clinicStatus === 'paid'
                      ? 'paid'
                      : 'pending'}
              </p>
              <p className="portal-finance-entry-card__status">Due: {formatMoney(clinicDue)}</p>
              <div className="portal-finance-entry-card__actions">
                <button
                  type="button"
                  className="portal-btn portal-btn--secondary"
                  onClick={() => {
                    if (selectedQuarter == null) return
                    const params = new URLSearchParams()
                    params.set('term', selectedQuarter.term)
                    params.set('year', String(selectedQuarter.year))
                    params.set('label', selectedQuarter.label)
                    navigate(`/finances/payment/clinic-fee?${params.toString()}`)
                  }}
                >
                  View Clinic Fee Status
                </button>
                <button
                  type="button"
                  className="portal-btn portal-btn--primary"
                  onClick={() => {
                    if (selectedQuarter == null) return
                    const params = new URLSearchParams()
                    params.set('term', selectedQuarter.term)
                    params.set('year', String(selectedQuarter.year))
                    params.set('label', selectedQuarter.label)
                    navigate(`/finances/payment/clinic-fee?${params.toString()}`)
                  }}
                  disabled={clinicDue <= 0 || clinicStatus !== 'pending'}
                >
                  Pay Clinic Fee
                </button>
              </div>
            </article>

            {examDue > 0 ? (
              <article className="portal-finance-entry-card">
                <h4 className="portal-finance-entry-card__title">Exam Fee</h4>
                <p className="portal-finance-entry-card__status">Due: {formatMoney(examDue)}</p>
                <p className="portal-finance-entry-card__status">
                  Exam fee is tracked separately from tuition installments.
                </p>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {error ? (
        <p className="portal-inline-note portal-inline-note--flush" role="alert">
          {t('ledgerCouldNotLoad')} {error}
        </p>
      ) : null}

      {loadingLedger && ledger == null ? (
        <p className="portal-inline-note portal-inline-note--flush" aria-busy="true">
          {t('loadingLedger')}
        </p>
      ) : ledger ? (
        <>
          {narrowMobile ? (
            <AccountingLedgerMobileCards ledger={ledger} dateLocale={dateLocale} t={t} />
          ) : (
            <div className="portal-table-wrap">
              <table className="portal-table portal-table--courses">
                <caption className="visually-hidden">
                  {t('ledgerCaptionPrefix')} {ledger.term} {ledger.year}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t('date')}</th>
                    <th scope="col">{t('type')}</th>
                    <th scope="col">{t('code')}</th>
                    <th scope="col">{t('description')}</th>
                    <th scope="col">{t('charge')}</th>
                    <th scope="col">{t('payment')}</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.rows.map((row: AccountingLedgerRow, index) => (
                    <tr key={`${row.date}-${index}-${row.memo}`}>
                      <td>{formatLedgerDate(row.date, dateLocale)}</td>
                      <td className="portal-table-cell-capitalize">{dashText(row.type)}</td>
                      <td>{dashText(row.code)}</td>
                      <td>
                        <div>{dashText(row.memo)}</div>
                        {row.clinicalBookingPaymentHold != null ? (
                          <ClinicalBookingPaymentHoldCountdown
                            hold={row.clinicalBookingPaymentHold}
                            t={t}
                          />
                        ) : null}
                      </td>
                      <td>{ledgerChargeCell(row.debit)}</td>
                      <td>{ledgerPaymentCell(row.credit)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" colSpan={4}>
                      {t('totalCharges')}
                    </th>
                    <td>{formatMoney(ledger.summary.totalCharges)}</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan={4}>
                      {t('totalPayments')}
                    </th>
                    <td>—</td>
                    <td>{formatMoney(ledger.summary.totalPayments)}</td>
                  </tr>
                  <tr>
                    <th scope="row" colSpan={4}>
                      {t('balance')}
                    </th>
                    <td colSpan={2}>{formatMoney(ledger.summary.balance)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}
