import { Link } from 'react-router-dom'

export function BackToDashboardLink() {
  return (
    <Link to="/dashboard" className="portal-back-to-dashboard-link">
      {'\u2190 Back to Dashboard'}
    </Link>
  )
}
