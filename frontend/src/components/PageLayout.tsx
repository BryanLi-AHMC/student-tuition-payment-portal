import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PORTAL_MOBILE_DRAWER_CLOSE_ID, PortalMobileNavDrawer, PortalSidebar } from './PortalSidebar'
import { PortalMainHeader } from './PortalMainHeader'

type PageLayoutProps = {
  children: ReactNode
  title: string
}

export function PageLayout({ children, title }: PageLayoutProps) {
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
      <PortalSidebar />
      <PortalMobileNavDrawer open={mobileNavOpen} onClose={closeMobileNav} />
      <div className="portal-main">
        <PortalMainHeader
          ref={mobileMenuButtonRef}
          title={title}
          mobileMenuOpen={mobileNavOpen}
          onMobileMenuToggle={toggleMobileNav}
        />
        <div className="portal-main-body">{children}</div>
      </div>
    </div>
  )
}
