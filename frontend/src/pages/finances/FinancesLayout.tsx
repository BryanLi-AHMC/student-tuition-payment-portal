import { Outlet } from 'react-router-dom'
import { BackToDashboardLink } from '../../components/BackToDashboardLink'
import { FinancesNav } from './FinancesNav'

export function FinancesLayout() {
  return (
    <div className="portal-finances-module">
      <header className="portal-module-header">
        <BackToDashboardLink />
        <h1 className="portal-page-title">Finances</h1>
      </header>
      <FinancesNav />
      <div className="portal-finances-outlet">
        <Outlet />
      </div>
    </div>
  )
}
