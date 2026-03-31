const MILESTONES = [
  { label: 'Pre-clinical core', status: 'In progress' },
  { label: 'USMLE Step 1 eligibility', status: 'Upcoming' },
  { label: 'Clinical rotations (core)', status: 'Not started' },
] as const

export function AcademicProgressPage() {
  const completed = 48
  const required = 180
  const pct = Math.round((completed / required) * 100)

  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Academic progress</h2>
      <p className="portal-page-lede">
        Track how your completed coursework aligns with program requirements. A full degree audit, including
        electives and milestone rules, will be expanded in a later phase.
      </p>

      <div className="portal-card portal-academics-progress-card">
        <p className="portal-card-label">Program completion (sample)</p>
        <div
          className="portal-academics-progress-track"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Program completion"
        >
          <div className="portal-academics-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="portal-card-note portal-academics-progress-caption">
          {pct}% of total program credits ({completed} of {required} credits)
        </p>
      </div>

      <div className="portal-grid-2">
        <div className="portal-card">
          <p className="portal-card-label">Completed credits</p>
          <p className="portal-card-value">{completed}</p>
        </div>
        <div className="portal-card">
          <p className="portal-card-label">Remaining credits (est.)</p>
          <p className="portal-card-value">{required - completed}</p>
        </div>
      </div>

      <section className="portal-module-panel" aria-labelledby="milestones-heading">
        <h3 id="milestones-heading" className="portal-module-panel-heading">
          Required milestones
        </h3>
        <ul className="portal-module-list">
          {MILESTONES.map((m) => (
            <li key={m.label} className="portal-module-list-item">
              <span className="portal-module-list-label">{m.label}</span>
              <span className="portal-module-list-badge">{m.status}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="portal-note">
        <strong>Coming later:</strong> Detailed requirement matching, substitution approvals, and catalog year
        rules will appear here as the academic progress experience matures.
      </p>
    </main>
  )
}
