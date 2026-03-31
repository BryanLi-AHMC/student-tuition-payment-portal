import { NavLink } from 'react-router-dom'

function navClassName(isActive: boolean) {
  return ['portal-nav-link', isActive ? 'portal-nav-link--active' : ''].filter(Boolean).join(' ')
}

const MAIN_NAV_ITEMS = [
  { to: '/registration', label: 'Registration' },
  { to: '/finances', label: 'Finances' },
  { to: '/academics', label: 'Academics' },
  { to: '/clinical', label: 'Clinical' },
  { to: '/documents', label: 'Documents' },
  { to: '/profile', label: 'My Account' },
] as const

type SidebarNavListProps = {
  onItemClick?: () => void
}

export function SidebarNavList({ onItemClick }: SidebarNavListProps) {
  const handleClick = () => {
    onItemClick?.()
  }

  return (
    <ul className="portal-sidebar-nav-list">
      {MAIN_NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            className={({ isActive }) => navClassName(isActive)}
            onClick={handleClick}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

/** Fixed left sidebar — visible on desktop only (see `portal.css`). */
export function Sidebar() {
  return (
    <aside className="portal-sidebar portal-sidebar--desktop" aria-label="Main navigation">
      <nav className="portal-sidebar-nav" aria-label="Portal modules">
        <SidebarNavList />
      </nav>
    </aside>
  )
}
