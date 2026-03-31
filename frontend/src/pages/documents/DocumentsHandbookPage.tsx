const QUICK = [
  {
    id: 'academic',
    title: 'Academic Policies',
    description: 'Grading, progression, remediation, and leave.',
  },
  {
    id: 'clinical',
    title: 'Clinical Training Standards',
    description: 'Sites, professionalism, patient interactions, and attire.',
  },
  {
    id: 'conduct',
    title: 'Attendance & Conduct',
    description: 'Expectations, attendance, and disciplinary procedures.',
  },
  {
    id: 'grad',
    title: 'Graduation Requirements',
    description: 'Credits, assessments, deadlines, and degree conferral.',
  },
] as const

export function DocumentsHandbookPage() {
  return (
    <main className="portal-page portal-documents-page-stack">
      <h2 className="portal-section-heading">Student Handbook</h2>
      <p className="portal-page-lede">
        The handbook is the authoritative reference for academic and professional expectations. Bookmark this
        page for quick access; your program may issue addenda each term.
      </p>
      <section className="portal-documents-handbook-hero" aria-labelledby="handbook-primary-heading">
        <div className="portal-documents-handbook-hero-inner">
          <p id="handbook-primary-heading" className="portal-documents-handbook-label">
            Current edition
          </p>
          <h3 className="portal-documents-handbook-title">School of Medicine Student Handbook</h3>
          <p className="portal-documents-handbook-edition">2025–2026 · Revised March 2026</p>
          <p className="portal-documents-handbook-desc">
            Comprehensive policies for the MD program, including professionalism, assessment, and clinical
            training. Sections align with accreditation and affiliate agreements.
          </p>
          <div className="portal-documents-handbook-actions">
            <button type="button" className="portal-btn portal-btn--primary">
              View Handbook
            </button>
            <button type="button" className="portal-btn portal-btn--secondary">
              Download PDF
            </button>
          </div>
        </div>
      </section>
      <section className="portal-module-panel" aria-labelledby="handbook-quick-heading">
        <h3 id="handbook-quick-heading" className="portal-module-panel-heading">
          Quick links
        </h3>
        <p className="portal-documents-quick-intro">
          Jump to common sections. Full navigation is available in the handbook viewer.
        </p>
        <ul className="portal-documents-quick-grid">
          {QUICK.map((item) => (
            <li key={item.id}>
              <button type="button" className="portal-documents-quick-card">
                <span className="portal-documents-quick-title">{item.title}</span>
                <span className="portal-documents-quick-desc">{item.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
