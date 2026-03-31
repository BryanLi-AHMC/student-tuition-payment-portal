import { Link } from 'react-router-dom'
import { DASHBOARD_ACCOUNT_SUMMARY_MOCK } from './dashboardMockData'

export function DashboardAccountSummary() {
  const { currentBalance, nextPaymentDue, holds } = DASHBOARD_ACCOUNT_SUMMARY_MOCK

  return (
    <section className="portal-dashboard-secondary-card" aria-labelledby="portal-dashboard-account-heading">
      <header className="portal-dashboard-secondary-card-head">
        <h2 id="portal-dashboard-account-heading" className="portal-dashboard-card-panel-title">
          Account Summary
        </h2>
      </header>
      <dl className="portal-dashboard-account-dl">
        <div className="portal-dashboard-account-row">
          <dt>Current Balance</dt>
          <dd>{currentBalance}</dd>
        </div>
        <div className="portal-dashboard-account-row">
          <dt>Next Payment Due</dt>
          <dd>{nextPaymentDue}</dd>
        </div>
        <div className="portal-dashboard-account-row">
          <dt>Holds</dt>
          <dd>{holds}</dd>
        </div>
      </dl>
      <div className="portal-dashboard-account-footer">
        <Link to="/finances" className="portal-text-link portal-dashboard-account-link">
          View Finances
        </Link>
      </div>
    </section>
  )
}
