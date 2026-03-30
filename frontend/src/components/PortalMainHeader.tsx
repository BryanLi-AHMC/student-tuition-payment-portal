import { forwardRef } from 'react'
import { PORTAL_MOBILE_NAV_DRAWER_ID } from './PortalSidebar'

const PORTAL_MOBILE_MENU_BUTTON_ID = 'portal-main-menu-button'

type PortalMainHeaderProps = {
  title: string
  mobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void
}

export const PortalMainHeader = forwardRef<HTMLButtonElement, PortalMainHeaderProps>(
  function PortalMainHeader({ title, mobileMenuOpen, onMobileMenuToggle }, ref) {
  return (
    <header className="portal-main-header">
      <div className="portal-main-header-inner">
        <div className="portal-main-header-leading">
          <button
            ref={ref}
            type="button"
            id={PORTAL_MOBILE_MENU_BUTTON_ID}
            className="portal-main-header-menu-btn"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen ?? false}
            aria-controls={PORTAL_MOBILE_NAV_DRAWER_ID}
            onClick={onMobileMenuToggle}
          >
            <span className="portal-main-header-menu-icon" aria-hidden="true" />
          </button>
          <h1 className="portal-main-header-title">{title}</h1>
        </div>
        <div className="portal-main-header-utilities">
          <span className="portal-main-header-placeholder" title="Reserved for future links">
            Notifications
          </span>
          <span className="portal-main-header-placeholder" title="Reserved for future links">
            Profile
          </span>
        </div>
      </div>
    </header>
  )
})

PortalMainHeader.displayName = 'PortalMainHeader'
