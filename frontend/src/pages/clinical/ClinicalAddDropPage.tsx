const CURRENT_ASSIGNMENT = {
  rotation: 'Ambulatory Medicine — Block 2',
  site: 'University Medical Group — East Clinic',
  weeks: 'Weeks 4–7 (Apr 6 – May 1, 2026)',
  coordinator: 'Clinical Education Office',
} as const

const AVAILABLE_SESSIONS = [
  {
    title: 'Inpatient Internal Medicine — Team B',
    site: 'Regional Health',
    window: 'May 4 – Jun 12, 2026',
    seats: '2 seats',
  },
  {
    title: 'Pediatric outpatient — afternoon block',
    site: "Children's Health Pavilion",
    window: 'Jun 15 – Jul 17, 2026',
    seats: 'Waitlist',
  },
] as const

export function ClinicalAddDropPage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Add / drop clinic</h2>
      <p className="portal-page-lede">
        Submit requests to add or release clinic placements when the add/drop window is open. Changes may
        require approval from your clerkship director and are subject to capacity and compliance clearance.
      </p>
      <div className="portal-stack portal-clinical-page-stack">
        <section className="portal-card portal-stack" aria-labelledby="current-clinic-heading">
          <h3 id="current-clinic-heading" className="portal-section-heading">
            Current clinic assignment
          </h3>
          <ul className="portal-registration-status-list portal-clinical-list-offset">
            <li className="portal-registration-status-item">
              <div>
                <p className="portal-registration-status-label">Rotation</p>
                <p className="portal-registration-status-value">{CURRENT_ASSIGNMENT.rotation}</p>
              </div>
            </li>
            <li className="portal-registration-status-item">
              <div>
                <p className="portal-registration-status-label">Site</p>
                <p className="portal-registration-status-value">{CURRENT_ASSIGNMENT.site}</p>
              </div>
            </li>
            <li className="portal-registration-status-item">
              <div>
                <p className="portal-registration-status-label">Schedule window</p>
                <p className="portal-registration-status-value">{CURRENT_ASSIGNMENT.weeks}</p>
              </div>
            </li>
            <li className="portal-registration-status-item">
              <div>
                <p className="portal-registration-status-label">Coordinating office</p>
                <p className="portal-registration-status-value">{CURRENT_ASSIGNMENT.coordinator}</p>
              </div>
            </li>
          </ul>
        </section>
        <section className="portal-card portal-stack" aria-labelledby="available-clinic-heading">
          <h3 id="available-clinic-heading" className="portal-section-heading">
            Available clinic sessions
          </h3>
          <p className="portal-inline-note portal-inline-note--flush">
            Sample listings for demonstration. When live, this section will reflect real capacity and
            eligibility from the clinical scheduling system.
          </p>
          <ul className="portal-module-list portal-clinical-list-offset-sm">
            {AVAILABLE_SESSIONS.map((row) => (
              <li key={row.title} className="portal-module-list-item">
                <div>
                  <span className="portal-module-list-label">{row.title}</span>
                  <div className="portal-clinical-meta-line">
                    {row.site} · {row.window}
                  </div>
                </div>
                <span className="portal-module-list-badge">{row.seats}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="portal-card portal-stack" aria-labelledby="add-drop-action-heading">
          <h3 id="add-drop-action-heading" className="portal-section-heading">
            Request changes
          </h3>
          <p className="portal-inline-note portal-inline-note--flush">
            Use the actions below to open a structured add/drop request. A coordinator will review and notify
            you by email.
          </p>
          <div className="portal-actions portal-clinical-actions-tight">
            <button type="button" className="portal-btn portal-btn--primary">
              Request add clinic
            </button>
            <button type="button" className="portal-btn portal-btn--secondary">
              Request drop / swap
            </button>
          </div>
          <p className="portal-inline-note portal-clinical-preview-note">
            Buttons are non-functional in this preview; they reserve space for the future workflow.
          </p>
        </section>
      </div>
    </main>
  )
}
