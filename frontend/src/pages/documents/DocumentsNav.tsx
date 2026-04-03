import { NavLink } from 'react-router-dom'

function linkClass(isActive: boolean) {
  return ['portal-tab', isActive ? 'portal-tab--active' : ''].filter(Boolean).join(' ')
}

const ITEMS = [
  { to: 'policies', label: 'Policies' },
  { to: 'forms', label: 'Forms' },
  { to: 'handbook', label: 'Handbook' },
  { to: 'uploads', label: 'Uploads' },
] as const

export function DocumentsNav() {
  return (
    <nav className="portal-documents-nav" aria-label="Documents and forms">
      <ul className="portal-tab-group">
        <li>
          <NavLink to="/documents" end className={({ isActive }) => linkClass(isActive)}>
            Overview
          </NavLink>
        </li>
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
