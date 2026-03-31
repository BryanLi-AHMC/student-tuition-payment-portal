import type { ReactNode } from 'react'
import { PortalShell } from './PortalShell'

type PageLayoutProps = {
  children: ReactNode
}

/** Authenticated layout for billing and legacy flows; includes the student account strip. */
export function PageLayout({ children }: PageLayoutProps) {
  return <PortalShell showStudentBar>{children}</PortalShell>
}
