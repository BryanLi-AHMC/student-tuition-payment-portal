type PolicyRow = {
  id: string
  title: string
  category: string
  effectiveDate: string
  actionLabel: 'View PDF' | 'Review'
}

const PRIVACY_POLICIES: readonly PolicyRow[] = [
  {
    id: 'ferpa',
    title: 'FERPA Policy',
    category: 'Privacy & records',
    effectiveDate: 'Aug 1, 2025',
    actionLabel: 'View PDF',
  },
  {
    id: 'privacy',
    title: 'Student Privacy Notice',
    category: 'Privacy & records',
    effectiveDate: 'Jan 15, 2026',
    actionLabel: 'View PDF',
  },
]

const ACADEMIC_POLICIES: readonly PolicyRow[] = [
  {
    id: 'copyright',
    title: 'Copyright Agreement',
    category: 'Intellectual property',
    effectiveDate: 'Jul 1, 2025',
    actionLabel: 'Review',
  },
  {
    id: 'integrity',
    title: 'Academic Integrity Policy',
    category: 'Academic conduct',
    effectiveDate: 'Sep 1, 2025',
    actionLabel: 'View PDF',
  },
]

function PolicySection({
  headingId,
  title,
  policies,
}: {
  headingId: string
  title: string
  policies: readonly PolicyRow[]
}) {
  return (
    <section className="portal-module-panel portal-documents-panel-stack" aria-labelledby={headingId}>
      <h3 id={headingId} className="portal-documents-section-heading">
        {title}
      </h3>
      <ul className="portal-documents-item-list">
        {policies.map((p) => (
          <li key={p.id} className="portal-documents-item">
            <div className="portal-documents-item-main">
              <p className="portal-documents-item-title">{p.title}</p>
              <p className="portal-documents-item-meta">
                <span className="portal-documents-item-category">{p.category}</span>
                <span className="portal-documents-item-sep" aria-hidden="true">
                  ·
                </span>
                <span>Effective {p.effectiveDate}</span>
              </p>
            </div>
            <button type="button" className="portal-btn portal-btn--secondary portal-btn--compact">
              {p.actionLabel}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function DocumentsPoliciesPage() {
  return (
    <main className="portal-page portal-documents-page-stack">
      <h2 className="portal-section-heading">Policies</h2>
      <p className="portal-page-lede">
        Official school policies govern privacy, conduct, and use of academic materials. Review the summary
        below and open the full document when you need to attest or share with third parties.
      </p>
      <PolicySection headingId="policies-privacy-heading" title="Privacy & student records" policies={PRIVACY_POLICIES} />
      <PolicySection
        headingId="policies-academic-heading"
        title="Academic & intellectual property"
        policies={ACADEMIC_POLICIES}
      />
      <p className="portal-inline-note portal-inline-note--flush">
        Policy PDFs and acknowledgment workflows will connect to the document management system in a future
        release. Contact the Registrar if you need a notarized or certified copy.
      </p>
    </main>
  )
}
