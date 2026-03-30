import { useAccount } from '../context/AccountContext'
import { formatMoney } from '../lib/formatMoney'

export function PortalStudentInfoBar() {
  const { account } = useAccount()
  const initials = account.student.name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section
      className="portal-student-info-bar"
      aria-label="Signed-in student"
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
            <p className="portal-student-info-bar-name">{account.student.name}</p>
          </div>
        </div>
        <div className="portal-student-info-bar-balance">
          <span className="portal-student-info-bar-balance-label">
            Balance
          </span>
          <span className="portal-student-info-bar-balance-amount">
            {formatMoney(account.summary.outstandingBalance)}
          </span>
        </div>
      </div>
    </section>
  )
}
