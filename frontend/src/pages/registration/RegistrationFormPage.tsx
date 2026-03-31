export function RegistrationFormPage() {
  return (
    <main className="portal-page">
      <p className="portal-page-lede">
        Some programs require a signed registration form each term. Use the actions below when your
        registrar or department publishes the current PDF or e-sign workflow.
      </p>
      <section className="portal-card portal-stack" aria-labelledby="registration-form-heading">
        <h2 id="registration-form-heading" className="portal-section-heading">
          Forms
        </h2>
        <div className="portal-actions">
          <button type="button" className="portal-btn portal-btn--primary">
            Download registration form
          </button>
          <button type="button" className="portal-btn portal-btn--secondary" disabled>
            Open e-sign (coming soon)
          </button>
        </div>
        <p className="portal-inline-note portal-inline-note--flush">
          Buttons are placeholders; file download and electronic signature will connect to your campus
          workflow later.
        </p>
        <div className="portal-registration-placeholder" role="status">
          Upload zone for signed PDFs or confirmation receipts can be added here.
        </div>
      </section>
    </main>
  )
}
