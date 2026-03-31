import { Outlet } from 'react-router-dom'
import { BackToDashboardLink } from '../../components/BackToDashboardLink'
import { ClinicalNav } from './ClinicalNav'

export function ClinicalLayout() {
  return (
    <div className="portal-clinical-module">
      <header className="portal-module-header">
        <BackToDashboardLink />
        <h1 className="portal-module-title">Clinical</h1>
        <p className="portal-module-subtitle">
          Manage clinic scheduling, evaluations, requirements, and training readiness.
        </p>
      </header>
      <ClinicalNav />
      <div className="portal-clinical-outlet">
        <Outlet />
      </div>
    </div>
  )
}
