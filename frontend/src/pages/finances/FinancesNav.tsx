import { NavLink } from 'react-router-dom'

function linkClass(isActive: boolean) {
  return ['portal-tab', isActive ? 'portal-tab--active' : ''].filter(Boolean).join(' ')
}

const ITEMS = [{ to: 'overview', label: 'Overview' }] as const

export function FinancesNav() {
  return (
    <nav className="portal-finances-nav" aria-label="Finances">
      <ul className="portal-tab-group">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={({ isActive }) => linkClass(isActive)}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
