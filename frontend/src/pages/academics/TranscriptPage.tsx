const SAMPLE_TERMS = ['Fall 2025', 'Summer 2025', 'Spring 2025', 'Fall 2024'] as const

export function TranscriptPage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Transcript</h2>
      <p className="portal-page-lede">
        Your transcript is the official record of your academic work. Unofficial copies are available for your
        review; official transcripts are issued on request and may incur a processing fee.
      </p>

      <div className="portal-stack">
        <section className="portal-card portal-academics-transcript-section" aria-labelledby="unofficial-heading">
          <h3 id="unofficial-heading" className="portal-section-heading">
            Unofficial transcript
          </h3>
          <p className="portal-card-note portal-academics-transcript-desc">
            View a web-based summary for advising and planning. This document is not certified for external use.
          </p>
          <div className="portal-actions portal-academics-transcript-actions">
            <button type="button" className="portal-btn portal-btn--primary">
              View unofficial transcript
            </button>
          </div>
        </section>

        <section className="portal-card portal-academics-transcript-section" aria-labelledby="official-heading">
          <h3 id="official-heading" className="portal-section-heading">
            Official transcript
          </h3>
          <p className="portal-card-note portal-academics-transcript-desc">
            Order a certified transcript for employers, licensing boards, or other institutions. Delivery options
            will be available in a later release.
          </p>
          <div className="portal-actions portal-academics-transcript-actions">
            <button type="button" className="portal-btn portal-btn--secondary">
              Request official transcript
            </button>
          </div>
        </section>
      </div>

      <section className="portal-module-panel" aria-labelledby="terms-heading">
        <h3 id="terms-heading" className="portal-module-panel-heading">
          Terms on record
        </h3>
        <ul className="portal-module-list">
          {SAMPLE_TERMS.map((term) => (
            <li key={term} className="portal-module-list-item">
              <span className="portal-module-list-label">{term}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="portal-card portal-academics-summary-block">
        <p className="portal-card-label">Summary</p>
        <p className="portal-card-value">Program: Doctor of Medicine (sample)</p>
        <p className="portal-card-note">
          Credits earned and GPA details appear on the full transcript view. Connect student records to replace
          this placeholder summary.
        </p>
      </div>
    </main>
  )
}
