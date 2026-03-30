import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { PORTAL_MOBILE_DRAWER_CLOSE_ID, PortalMobileNavDrawer, PortalSidebar } from './PortalSidebar'
import { PortalAppHeader } from './PortalAppHeader'
import { PortalStudentInfoBar } from './PortalStudentInfoBar'

const AUTH_ROUTE_TITLES: Record<string, string> = {
  '/overview': 'Student Account',
  '/activity': 'Activity Details',
  '/payment': 'Make a Payment',
  '/plan': 'Payment Plan',
  '/statements': 'Statements',
}

function pageTitleForPath(pathname: string): string {
  return AUTH_ROUTE_TITLES[pathname] ?? 'Portal'
}

type PageLayoutProps = {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  const { pathname } = useLocation()
  const pageTitle = pageTitleForPath(pathname)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const wasDrawerOpenRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)')
    const closeOnDesktop = () => {
      if (mq.matches) setMobileNavOpen(false)
    }
    mq.addEventListener('change', closeOnDesktop)
    return () => mq.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  useEffect(() => {
    if (mobileNavOpen) {
      wasDrawerOpenRef.current = true
      const closeBtn = document.getElementById(PORTAL_MOBILE_DRAWER_CLOSE_ID) as HTMLButtonElement | null
      closeBtn?.focus()
    } else if (wasDrawerOpenRef.current) {
      wasDrawerOpenRef.current = false
      if (window.matchMedia('(max-width: 768px)').matches) {
        mobileMenuButtonRef.current?.focus()
      }
    }
  }, [mobileNavOpen])

  const closeMobileNav = () => setMobileNavOpen(false)
  const toggleMobileNav = () => setMobileNavOpen((open) => !open)

  return (
    <div className="portal-shell portal-shell--authenticated">
      <PortalAppHeader
        ref={mobileMenuButtonRef}
        title={pageTitle}
        mobileMenuOpen={mobileNavOpen}
        onMobileMenuToggle={toggleMobileNav}
      />
      <PortalSidebar />
      <PortalMobileNavDrawer open={mobileNavOpen} onClose={closeMobileNav} />
      <div className="portal-main">
        <PortalStudentInfoBar />
        <div className="portal-main-body">{children}</div>
      </div>
    </div>
  )
}
