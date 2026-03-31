import { Outlet } from 'react-router-dom'
import { AcademicsNav } from './AcademicsNav'

export function AcademicsLayout() {
  return (
    <div className="portal-academics-module">
      <header className="portal-module-header">
        <h1 className="portal-module-title">Academics</h1>
        <p className="portal-module-subtitle">
          Review grades, transcripts, GPA, and academic record services.
        </p>
      </header>
      <AcademicsNav />
      <div className="portal-academics-outlet">
        <Outlet />
      </div>
    </div>
  )
}
