import { Outlet } from 'react-router-dom'
import { BackToDashboardLink } from '../../components/BackToDashboardLink'

export function FinancesLayout() {
  return (
    <div className="portal-finances-module">
      <header className="portal-module-header">
        <BackToDashboardLink />
        <h1 className="portal-module-title">Finances</h1>
      </header>
      <div className="portal-finances-outlet">
        <Outlet />
      </div>
    </div>
  )
}
