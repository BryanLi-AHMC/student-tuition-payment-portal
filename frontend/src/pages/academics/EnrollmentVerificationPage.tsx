export function EnrollmentVerificationPage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Enrollment verification</h2>
      <p className="portal-page-lede">
        Enrollment verification confirms your status as a registered student for a given term. Common uses
        include loan deferments, health insurance, housing, and employer verification.
      </p>

      <div className="portal-actions portal-academics-enrollment-actions">
        <button type="button" className="portal-btn portal-btn--primary">
          Request verification letter
        </button>
        <button type="button" className="portal-btn portal-btn--secondary">
          Download current enrollment confirmation
        </button>
      </div>

      <section className="portal-module-panel" aria-labelledby="status-heading">
        <h3 id="status-heading" className="portal-module-panel-heading">
          Current status (sample)
        </h3>
        <ul className="portal-module-list">
          <li className="portal-module-list-item">
            <span className="portal-module-list-label">Term</span>
            <span>Spring 2026</span>
          </li>
          <li className="portal-module-list-item">
            <span className="portal-module-list-label">Enrollment</span>
            <span className="portal-status portal-status--paid">Full-time</span>
          </li>
          <li className="portal-module-list-item">
            <span className="portal-module-list-label">Program</span>
            <span>Doctor of Medicine</span>
          </li>
          <li className="portal-module-list-item">
            <span className="portal-module-list-label">Expected graduation</span>
            <span>May 2028</span>
          </li>
        </ul>
      </section>

      <p className="portal-inline-note">
        Third-party verifier services and batch requests can be integrated when backend workflows are ready.
        For urgent or specialized letters, contact the Office of the Registrar.
      </p>
    </main>
  )
}
