export function ClinicalExamPracticePage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Clinic entrance exam practice</h2>
      <p className="portal-page-lede">
        Use this area to prepare for the clinical readiness assessment. Practice exams mirror the structure
        and timing of the live evaluation; study materials summarize high-yield topics mapped to your
        clerkship objectives.
      </p>
      <section className="portal-module-panel portal-clinical-exam-readiness" aria-labelledby="exam-readiness-heading">
        <h3 id="exam-readiness-heading" className="portal-module-panel-heading">
          Readiness overview
        </h3>
        <div className="portal-grid-2">
          <div className="portal-card">
            <p className="portal-card-label">Next assessment window</p>
            <p className="portal-card-value">Apr 18 – Apr 22, 2026</p>
            <p className="portal-card-note">You may complete one official attempt during this period.</p>
          </div>
          <div className="portal-card">
            <p className="portal-card-label">Practice attempts left</p>
            <p className="portal-card-value">Unlimited (sample)</p>
            <p className="portal-card-note">Unscored runs help you learn navigation and pacing.</p>
          </div>
        </div>
      </section>
      <section className="portal-module-panel" aria-labelledby="exam-actions-heading">
        <h3 id="exam-actions-heading" className="portal-module-panel-heading">
          Actions
        </h3>
        <ul className="portal-module-list">
          <li className="portal-module-list-item portal-clinical-action-row">
            <div>
              <span className="portal-module-list-label">Start practice exam</span>
              <p className="portal-clinical-meta-line portal-clinical-meta-line--flush">
                Timed, full-length practice with automated feedback on section scores.
              </p>
            </div>
            <button type="button" className="portal-btn portal-btn--primary portal-btn--compact">
              Start
            </button>
          </li>
          <li className="portal-module-list-item portal-clinical-action-row">
            <div>
              <span className="portal-module-list-label">Review study materials</span>
              <p className="portal-clinical-meta-line portal-clinical-meta-line--flush">
                Curated readings, algorithms, and site-specific protocols for your phase.
              </p>
            </div>
            <button type="button" className="portal-btn portal-btn--secondary portal-btn--compact">
              Open
            </button>
          </li>
          <li className="portal-module-list-item portal-clinical-action-row">
            <div>
              <span className="portal-module-list-label">View practice attempts</span>
              <p className="portal-clinical-meta-line portal-clinical-meta-line--flush">
                History of prior practice runs and time-on-task summaries.
              </p>
            </div>
            <button type="button" className="portal-btn portal-btn--secondary portal-btn--compact">
              History
            </button>
          </li>
        </ul>
      </section>
    </main>
  )
}
