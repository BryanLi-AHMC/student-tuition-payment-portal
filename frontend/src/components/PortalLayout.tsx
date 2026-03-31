import { Outlet, useLocation } from 'react-router-dom'
import { PortalShell } from './PortalShell'

function isDashboardRoute(pathname: string) {
  return pathname === '/dashboard' || pathname === '/dashboard/'
}

/** Layout route wrapper for authenticated portal modules. Finances shows the student account strip. */
export function PortalLayout() {
  const { pathname } = useLocation()
  const showStudentBar = pathname.startsWith('/finances')
  const showSidebar = !isDashboardRoute(pathname)

  return (
    <PortalShell showStudentBar={showStudentBar} showSidebar={showSidebar}>
      <Outlet />
    </PortalShell>
  )
}
