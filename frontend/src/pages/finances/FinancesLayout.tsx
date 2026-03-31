import { Outlet } from 'react-router-dom'
import { BackToDashboardLink } from '../../components/BackToDashboardLink'
import { FinancesNav } from './FinancesNav'

export function FinancesLayout() {
  return (
    <div className="portal-finances-module">
      <header className="portal-module-header">
        <BackToDashboardLink />
        <h1 className="portal-module-title">Finances</h1>
        <p className="portal-module-subtitle">
          Student account, payments, billing activity, and documents for your program.
        </p>
      </header>
      <FinancesNav />
      <div className="portal-finances-outlet">
        <Outlet />
      </div>
    </div>
  )
}
