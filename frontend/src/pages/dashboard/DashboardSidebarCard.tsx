import { DashboardCurrentPostedTerm } from './DashboardCurrentPostedTerm'
import { DashboardServiceLauncher } from './DashboardServiceLauncher'

export function DashboardSidebarCard() {
  return (
    <section
      className="portal-dashboard-sidebar-card"
      aria-labelledby="portal-dashboard-sidebar-services-heading"
    >
      <DashboardServiceLauncher
        embedded
        headingId="portal-dashboard-sidebar-services-heading"
      />
      <div className="portal-dashboard-sidebar-divider" aria-hidden />
      <DashboardCurrentPostedTerm
        embedded
        headingId="portal-dashboard-sidebar-current-term-heading"
      />
    </section>
  )
}
