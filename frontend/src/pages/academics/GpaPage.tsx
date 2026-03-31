export function GpaPage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">GPA</h2>
      <p className="portal-page-lede">
        Grade point averages are computed from graded credits according to institutional policy. Figures below
        are illustrative; live data will sync from your academic record.
      </p>

      <div className="portal-grid-4">
        <div className="portal-card">
          <p className="portal-card-label">Cumulative GPA</p>
          <p className="portal-card-value">3.72</p>
          <p className="portal-card-note">All terms, graded credits only.</p>
        </div>
        <div className="portal-card">
          <p className="portal-card-label">Term GPA (Fall 2025)</p>
          <p className="portal-card-value">3.81</p>
          <p className="portal-card-note">Most recently completed term.</p>
        </div>
        <div className="portal-card">
          <p className="portal-card-label">Completed credits</p>
          <p className="portal-card-value">48</p>
          <p className="portal-card-note">Successfully completed toward degree.</p>
        </div>
        <div className="portal-card">
          <p className="portal-card-label">Attempted credits</p>
          <p className="portal-card-value">51</p>
          <p className="portal-card-note">Includes courses in progress where applicable.</p>
        </div>
      </div>

      <p className="portal-inline-note">
        Repeat coursework, pass/fail elections, and remediation may be handled differently in the official
        calculation. See the academic handbook for policy details.
      </p>
    </main>
  )
}
