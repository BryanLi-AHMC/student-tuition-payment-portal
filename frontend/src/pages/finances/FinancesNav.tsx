import { NavLink } from 'react-router-dom'

function linkClass(isActive: boolean) {
  return ['portal-finances-nav-link', isActive ? 'portal-finances-nav-link--active' : ''].filter(Boolean).join(' ')
}

const ITEMS = [
  { to: 'overview', label: 'Account Summary' },
  { to: 'payment', label: 'Make a Payment' },
  { to: 'history', label: 'Payment History' },
  { to: 'statements', label: 'Statements' },
  { to: 'late-fees', label: 'Late Fees' },
] as const

export function FinancesNav() {
  return (
    <nav className="portal-finances-nav" aria-label="Finances">
      <ul className="portal-finances-nav-list">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={({ isActive }) => linkClass(isActive)} end={item.to === 'overview'}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
