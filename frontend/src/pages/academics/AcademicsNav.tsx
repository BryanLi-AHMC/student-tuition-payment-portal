import { NavLink } from 'react-router-dom'

function linkClass(isActive: boolean) {
  return ['portal-academics-nav-link', isActive ? 'portal-academics-nav-link--active' : ''].filter(Boolean).join(' ')
}

const ITEMS = [
  { to: 'grades', label: 'Grades' },
  { to: 'transcript', label: 'Transcript' },
  { to: 'gpa', label: 'GPA' },
  { to: 'progress', label: 'Academic Progress' },
  { to: 'enrollment-verification', label: 'Enrollment Verification' },
] as const

export function AcademicsNav() {
  return (
    <nav className="portal-academics-nav" aria-label="Academics">
      <ul className="portal-academics-nav-list">
        <li>
          <NavLink to="/academics" end className={({ isActive }) => linkClass(isActive)}>
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
