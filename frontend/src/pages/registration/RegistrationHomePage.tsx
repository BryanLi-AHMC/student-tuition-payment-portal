import { NavLink } from 'react-router-dom'

const ACTIONS = [
  {
    to: 'add-drop',
    title: 'Add / Drop Courses',
    description: 'Adjust your course load during the published add/drop period.',
  },
  {
    to: 'search',
    title: 'Course Search',
    description: 'Browse sections, seats, and meeting times before you register.',
  },
  {
    to: 'schedule',
    title: 'My Timetable',
    description: 'View your weekly class and exam schedule for the term.',
  },
  {
    to: 'form',
    title: 'Registration Form',
    description: 'Download or submit program registration paperwork when required.',
  },
  {
    to: 'status',
    title: 'Registration Status',
    description: 'See holds, approvals, and credits registered for the current term.',
  },
] as const

export function RegistrationHomePage() {
  return (
    <main className="portal-page">
      <section className="portal-module-panel" aria-labelledby="registration-actions-heading">
        <h2 id="registration-actions-heading" className="portal-module-panel-heading">
          Registration services
        </h2>
        <ul className="portal-registration-action-grid">
          {ACTIONS.map((action) => (
            <li key={action.to}>
              <NavLink to={action.to} className="portal-registration-action-card">
                <span className="portal-registration-action-arrow" aria-hidden="true">
                  →
                </span>
                <h3 className="portal-registration-action-title">{action.title}</h3>
                <p className="portal-registration-action-desc">{action.description}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
