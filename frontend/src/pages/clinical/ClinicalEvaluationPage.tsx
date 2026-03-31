const PENDING = [
  {
    id: 'ev-104',
    rotation: 'Ambulatory Medicine — East Clinic',
    evaluator: 'Dr. Jordan Ellis, MD',
    due: 'Apr 12, 2026',
  },
  {
    id: 'ev-105',
    rotation: 'Clinical Skills — Procedure lab',
    evaluator: 'Dr. Samira Okonkwo, MD',
    due: 'Apr 20, 2026',
  },
] as const

const COMPLETED = [
  {
    id: 'ev-098',
    rotation: 'Foundations pre-clinical immersion',
    submitted: 'Mar 4, 2026',
    status: 'Released to student',
  },
  {
    id: 'ev-101',
    rotation: 'Primary care longitudinal clinic',
    submitted: 'Feb 19, 2026',
    status: 'Released to student',
  },
] as const

export function ClinicalEvaluationPage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Submit evaluation</h2>
      <p className="portal-page-lede">
        Complete end-of-rotation evaluations for your supervising faculty and clinical sites. Submissions are
        routed to the clerkship office and may be required before grades or schedule releases are finalized.
      </p>
      <section className="portal-module-panel portal-stack" aria-labelledby="pending-eval-heading">
        <h3 id="pending-eval-heading" className="portal-module-panel-heading">
          Pending evaluations
        </h3>
        <ul className="portal-registration-status-list">
          {PENDING.map((row) => (
            <li key={row.id} className="portal-registration-status-item">
              <div>
                <p className="portal-registration-status-label">Rotation</p>
                <p className="portal-registration-status-value">{row.rotation}</p>
                <p className="portal-clinical-meta-line">
                  {row.evaluator} · Due {row.due}
                </p>
              </div>
              <div className="portal-actions portal-clinical-inline-actions">
                <button type="button" className="portal-btn portal-btn--primary portal-btn--compact">
                  Continue
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="portal-module-panel portal-stack" aria-labelledby="completed-eval-heading">
        <h3 id="completed-eval-heading" className="portal-module-panel-heading">
          Completed evaluations
        </h3>
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th scope="col">Rotation</th>
                <th scope="col">Submitted</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPLETED.map((row) => (
                <tr key={row.id}>
                  <td>{row.rotation}</td>
                  <td>{row.submitted}</td>
                  <td>
                    <span className="portal-status portal-status--paid">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="portal-note" role="note">
        <strong>New evaluation available?</strong> If a preceptor shared a link or access code, use{' '}
        <em>Start new evaluation</em> below. Otherwise open a pending item from the list above.
      </section>
      <div className="portal-actions">
        <button type="button" className="portal-btn portal-btn--secondary">
          Start new evaluation
        </button>
      </div>
    </main>
  )
}
