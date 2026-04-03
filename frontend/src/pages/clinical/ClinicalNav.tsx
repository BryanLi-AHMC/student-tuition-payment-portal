import { NavLink } from 'react-router-dom'

function linkClass(isActive: boolean) {
  return ['portal-tab', isActive ? 'portal-tab--active' : ''].filter(Boolean).join(' ')
}

const ITEMS = [
  { to: 'schedule', label: 'Clinic Schedule' },
  { to: 'add-drop', label: 'Add / Drop Clinic' },
  { to: 'exam-practice', label: 'Exam Practice' },
  { to: 'evaluation', label: 'Submit Evaluation' },
  { to: 'required-hours', label: 'Required Hours' },
  { to: 'compliance', label: 'Compliance' },
] as const

export function ClinicalNav() {
  return (
    <nav className="portal-clinical-nav" aria-label="Clinical">
      <ul className="portal-tab-group">
        <li>
          <NavLink to="/clinical" end className={({ isActive }) => linkClass(isActive)}>
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
