const CATEGORIES = [
  { label: 'Ambulatory / outpatient', completed: 112, required: 160 },
  { label: 'Inpatient / hospital', completed: 96, required: 192 },
  { label: 'Procedures & skills lab', completed: 24, required: 32 },
] as const

const TOTAL_REQUIRED = 480
const TOTAL_COMPLETED = 312

export function ClinicalRequiredHoursPage() {
  const pct = Math.round((TOTAL_COMPLETED / TOTAL_REQUIRED) * 100)
  const remaining = TOTAL_REQUIRED - TOTAL_COMPLETED

  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Required hours</h2>
      <p className="portal-page-lede">
        Clinical credit and promotion depend on verified time in supervised settings. Hours below are
        illustrative; final totals will sync from your time log and site attestations when the module is
        connected to your program systems.
      </p>
      <section className="portal-card portal-academics-progress-card" aria-labelledby="hours-progress-heading">
        <h3 id="hours-progress-heading" className="portal-section-heading">
          Overall progress
        </h3>
        <div className="portal-grid-4">
          <div>
            <p className="portal-card-label">Total required</p>
            <p className="portal-card-value">{TOTAL_REQUIRED} hrs</p>
          </div>
          <div>
            <p className="portal-card-label">Logged & verified</p>
            <p className="portal-card-value">{TOTAL_COMPLETED} hrs</p>
          </div>
          <div>
            <p className="portal-card-label">Remaining</p>
            <p className="portal-card-value">{remaining} hrs</p>
          </div>
          <div>
            <p className="portal-card-label">Progress</p>
            <p className="portal-card-value">{pct}%</p>
          </div>
        </div>
        <div className="portal-academics-progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="portal-academics-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="portal-academics-progress-caption portal-inline-note portal-inline-note--flush">
          Target: complete ambulatory and inpatient minimums before the end-of-phase deadline published by
          clinical affairs.
        </p>
      </section>
      <section className="portal-module-panel" aria-labelledby="hours-by-category-heading">
        <h3 id="hours-by-category-heading" className="portal-module-panel-heading">
          By training category
        </h3>
        <ul className="portal-module-list">
          {CATEGORIES.map((cat) => {
            const c = Math.min(100, Math.round((cat.completed / cat.required) * 100))
            return (
              <li key={cat.label} className="portal-module-list-item portal-clinical-hours-row">
                <div className="portal-clinical-hours-info">
                  <span className="portal-module-list-label">{cat.label}</span>
                  <span className="portal-clinical-meta-line portal-clinical-meta-line--flush">
                    {cat.completed} of {cat.required} hours
                  </span>
                  <div className="portal-academics-progress-track portal-clinical-hours-bar">
                    <div className="portal-academics-progress-fill" style={{ width: `${c}%` }} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
