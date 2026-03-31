import type { DashboardService } from './dashboardMockData'

type Props = {
  name: DashboardService['icon']
  className?: string
}

/** Small outline icons for the service launcher — decorative only. */
export function DashboardServiceIcon({ name, className }: Props) {
  const cn = ['portal-dashboard-service-glyph', className].filter(Boolean).join(' ')
  switch (name) {
    case 'registration':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 5h12M8 12h12M8 19h6M4 5h.01M4 12h.01M4 19h.01"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'finances':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M9 10h4.5a1.5 1.5 0 010 3H10.5M10 10V8m0 8v-1.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'academics':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 6.5 12 3l7 3.5V18a1 1 0 01-1 1H6a1 1 0 01-1-1V6.5z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
    case 'clinical':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11" r="2.25" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      )
    case 'documents':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 3h6l4 4v14a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path d="M14 3v4h4M10 13h6M10 17h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
    case 'account':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M6.5 19.1v-.6a4 4 0 014-4h3a4 4 0 014 4v.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      )
    default:
      return null
  }
}
