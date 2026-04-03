import { Outlet } from 'react-router-dom'
import { BackToDashboardLink } from '../../components/BackToDashboardLink'

export function AcademicsLayout() {
  return (
    <div className="portal-academics-module">
      <header className="portal-module-header portal-academics-print-hide">
        <BackToDashboardLink />
        <h1 className="portal-page-title">Academics</h1>
      </header>
      <div className="portal-academics-outlet">
        <Outlet />
      </div>
    </div>
  )
}
