import { DashboardCoursesWidget } from './dashboard/DashboardCoursesWidget'
import { DashboardServiceLauncher } from './dashboard/DashboardServiceLauncher'

const TERM_LABEL = 'Spring 2026'

export function DashboardPage() {
  return (
    <main className="portal-page portal-dashboard">
      <header className="portal-dashboard-hero">
        <h1 className="portal-dashboard-hero-title">Welcome, Bingchen</h1>
      </header>

      <div className="portal-dashboard-home-grid">
        <div className="portal-dashboard-home-primary">
          <DashboardServiceLauncher />
        </div>
        <div className="portal-dashboard-home-aside">
          <DashboardCoursesWidget termLabel={TERM_LABEL} />
        </div>
      </div>
    </main>
  )
}
