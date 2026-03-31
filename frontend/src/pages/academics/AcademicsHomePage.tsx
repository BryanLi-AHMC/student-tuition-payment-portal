import { NavLink } from 'react-router-dom'

const ACTIONS = [
  {
    to: 'grades',
    title: 'View Grades',
    description: 'See final grades and credits by course for recent terms.',
  },
  {
    to: 'transcript',
    title: 'Transcript',
    description: 'View unofficial records or request an official transcript.',
  },
  {
    to: 'gpa',
    title: 'GPA',
    description: 'Review cumulative and term GPA with credit summaries.',
  },
  {
    to: 'progress',
    title: 'Academic Progress',
    description: 'Track degree milestones and credits toward your program.',
  },
  {
    to: 'enrollment-verification',
    title: 'Enrollment Verification',
    description: 'Request letters or proof of enrollment for third parties.',
  },
] as const

export function AcademicsHomePage() {
  return (
    <main className="portal-page">
      <p className="portal-page-lede portal-academics-home-lede">
        Access academic records, transcripts, GPA information, and student verification services.
      </p>
      <section className="portal-module-panel" aria-labelledby="academics-actions-heading">
        <h3 id="academics-actions-heading" className="portal-module-panel-heading">
          Academic services
        </h3>
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
