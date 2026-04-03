import { Outlet } from 'react-router-dom'
import { BackToDashboardLink } from '../../components/BackToDashboardLink'
import { ClinicalNav } from './ClinicalNav'

export function ClinicalLayout() {
  return (
    <div className="portal-clinical-module">
      <header className="portal-module-header">
        <BackToDashboardLink />
        <h1 className="portal-page-title">Clinical</h1>
      </header>
      <ClinicalNav />
      <div className="portal-clinical-outlet">
        <Outlet />
      </div>
    </div>
  )
}
