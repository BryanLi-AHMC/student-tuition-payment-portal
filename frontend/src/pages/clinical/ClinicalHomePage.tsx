import { NavLink } from 'react-router-dom'

const ACTIONS = [
  {
    to: 'schedule',
    title: 'Clinic Schedule',
    description: 'View assigned sessions, sites, preceptors, and rotation status for the term.',
  },
  {
    to: 'add-drop',
    title: 'Add / Drop Clinic',
    description: 'Request changes to clinic placements within program rules and deadlines.',
  },
  {
    to: 'exam-practice',
    title: 'Clinic Entrance Exam Practice',
    description: 'Prepare with timed practice items and review materials before your clinical assessment.',
  },
  {
    to: 'evaluation',
    title: 'Submit Evaluation',
    description: 'Complete pending evaluations for rotations and supervising faculty.',
  },
  {
    to: 'required-hours',
    title: 'Required Hours',
    description: 'Track clinical hours logged toward program and accreditation requirements.',
  },
  {
    to: 'compliance',
    title: 'Compliance',
    description: 'Confirm training, certifications, immunizations, and background requirements.',
  },
] as const

export function ClinicalHomePage() {
  return (
    <main className="portal-page">
      <section className="portal-module-panel" aria-labelledby="clinical-actions-heading">
        <h2 id="clinical-actions-heading" className="portal-module-panel-heading">
          Clinical training
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
