import { NavLink } from 'react-router-dom'

const ACTIONS = [
  {
    to: 'policies',
    title: 'Policies',
    description: 'FERPA, copyright, privacy, and academic integrity policies with effective dates.',
  },
  {
    to: 'forms',
    title: 'Forms',
    description: 'Registration, financial, clinical, and general student forms in one place.',
  },
  {
    to: 'handbook',
    title: 'Student Handbook',
    description: 'Policies, standards, conduct expectations, and graduation requirements.',
  },
  {
    to: 'uploads',
    title: 'Uploads',
    description: 'Submitted files, compliance uploads, and submission history (when enabled).',
  },
] as const

export function DocumentsHomePage() {
  return (
    <main className="portal-page">
      <p className="portal-page-lede portal-documents-home-lede">
        Find school policies, downloadable forms, handbook resources, and document submissions.
      </p>
      <section className="portal-module-panel" aria-labelledby="documents-actions-heading">
        <h2 id="documents-actions-heading" className="portal-module-panel-heading">
          Document center
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
