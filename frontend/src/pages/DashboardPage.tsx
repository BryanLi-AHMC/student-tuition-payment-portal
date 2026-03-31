import { DashboardCoursesWidget } from './dashboard/DashboardCoursesWidget'
import { DashboardServiceLauncher } from './dashboard/DashboardServiceLauncher'

const TERM_LABEL = 'Spring 2026'

export function DashboardPage() {
  return (
    <main className="portal-page portal-dashboard">
      <header className="portal-dashboard-hero">
        <p className="portal-dashboard-hero-context">{TERM_LABEL}</p>
        <h1 className="portal-dashboard-hero-title">Welcome</h1>
        <p className="portal-dashboard-hero-sub">
          Access student services from <strong>Services</strong>, or view your enrollment for this term in{' '}
          <strong>My Courses</strong>.
        </p>
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
