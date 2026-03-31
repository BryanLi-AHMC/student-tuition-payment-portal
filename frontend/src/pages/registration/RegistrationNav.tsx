import { NavLink } from 'react-router-dom'

function linkClass(isActive: boolean) {
  return ['portal-registration-nav-link', isActive ? 'portal-registration-nav-link--active' : '']
    .filter(Boolean)
    .join(' ')
}

const ITEMS = [
  { to: 'add-drop', label: 'Add / Drop' },
  { to: 'search', label: 'Course Search' },
  { to: 'schedule', label: 'My Timetable' },
  { to: 'form', label: 'Registration Form' },
  { to: 'status', label: 'Status' },
] as const

export function RegistrationNav() {
  return (
    <nav className="portal-registration-nav" aria-label="Registration">
      <ul className="portal-registration-nav-list">
        <li>
          <NavLink to="/registration" end className={({ isActive }) => linkClass(isActive)}>
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
