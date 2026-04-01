import { useAccount } from '../context/AccountContext'
import { formatMoney } from '../lib/formatMoney'

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) {
    return '—'
  }
  return parts
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function PortalStudentInfoBar() {
  const { fetchedAccount, loading, error } = useAccount()

  const showLiveData = !loading && !error && fetchedAccount !== null
  const displayName = showLiveData
    ? fetchedAccount.student.name
    : loading
      ? 'Loading…'
      : error
        ? 'Account unavailable'
        : '—'

  const balanceAmount = showLiveData
    ? formatMoney(fetchedAccount.summary.outstandingBalance)
    : '—'

  const initials = showLiveData
    ? initialsFromName(fetchedAccount.student.name)
    : loading
      ? '…'
      : '—'

  return (
    <section
      className="portal-student-info-bar"
      aria-label="Signed-in student"
      aria-busy={loading}
    >
      <div className="portal-student-info-bar-inner">
        <div className="portal-student-info-bar-identity">
          <div
            className="portal-student-info-bar-avatar"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="portal-student-info-bar-text">
            <p className="portal-student-info-bar-name">{displayName}</p>
            {error ? (
              <p
                className="portal-student-info-bar-name"
                style={{ fontSize: '0.85em', opacity: 0.85 }}
                role="status"
              >
                {error}
              </p>
            ) : null}
          </div>
        </div>
        <div className="portal-student-info-bar-balance">
          <span className="portal-student-info-bar-balance-label">
            Balance
          </span>
          <span className="portal-student-info-bar-balance-amount">
            {balanceAmount}
          </span>
        </div>
      </div>
    </section>
  )
}
