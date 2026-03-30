import { INSTITUTION_NAME, PORTAL_SYSTEM_NAME } from '../branding'

export function PortalHeader() {
  return (
    <header className="portal-header">
      <div className="portal-header-inner">
        <span className="portal-brand">{INSTITUTION_NAME}</span>
        <span className="portal-header-tagline">{PORTAL_SYSTEM_NAME}</span>
      </div>
    </header>
  )
}
