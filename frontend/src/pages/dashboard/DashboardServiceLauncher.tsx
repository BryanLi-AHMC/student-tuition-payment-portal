import { Link } from 'react-router-dom'
import type { DashboardService } from './dashboardMockData'
import { DASHBOARD_SERVICES } from './dashboardMockData'
import { DashboardServiceIcon } from './DashboardServiceIcon'

function ServiceTile({ service }: { service: DashboardService }) {
  return (
    <li>
      <Link to={service.to} className="portal-dashboard-service-tile">
        <span className="portal-dashboard-service-tile-icon" aria-hidden>
          <DashboardServiceIcon name={service.icon} />
        </span>
        <span className="portal-dashboard-service-tile-body">
          <span className="portal-dashboard-service-tile-title">{service.title}</span>
          <span className="portal-dashboard-service-tile-desc">{service.description}</span>
        </span>
        <span className="portal-dashboard-service-tile-cta" aria-hidden>
          Open
        </span>
      </Link>
    </li>
  )
}

export function DashboardServiceLauncher() {
  return (
    <section className="portal-dashboard-services" aria-labelledby="portal-dashboard-services-heading">
      <div className="portal-dashboard-services-head">
        <h2 id="portal-dashboard-services-heading" className="portal-dashboard-section-title">
          Services
        </h2>
        <p className="portal-dashboard-section-lede">
          Jump to registration, finances, academics, and other portal modules. When you open a module, use the
          menu on the left to move within that area.
        </p>
      </div>
      <ul className="portal-dashboard-service-grid">
        {DASHBOARD_SERVICES.map((service) => (
          <ServiceTile key={service.to} service={service} />
        ))}
      </ul>
    </section>
  )
}
