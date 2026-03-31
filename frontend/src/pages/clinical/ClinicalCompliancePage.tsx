type ComplianceRequirement = {
  id: string
  title: string
  detail: string
  status: 'Complete' | 'Pending' | 'Expiring Soon'
  meta?: string
}

const REQUIREMENTS: readonly ComplianceRequirement[] = [
  {
    id: 'hipaa',
    title: 'HIPAA & privacy training',
    detail: 'Annual module — School of Medicine compliance suite',
    status: 'Complete',
  },
  {
    id: 'bls',
    title: 'CPR / BLS certification',
    detail: 'AHA instructor-led; card on file with student health',
    status: 'Expiring Soon',
    meta: 'Expires Jul 2, 2026',
  },
  {
    id: 'imm',
    title: 'Immunization records',
    detail: 'TB, MMR, varicella, hepatitis B, COVID-19 per clinical affiliate policy',
    status: 'Complete',
  },
  {
    id: 'bg',
    title: 'Background check',
    detail: 'Criminal background and sanctions screening for clinical placement',
    status: 'Complete',
  },
  {
    id: 'annual',
    title: 'Annual compliance review',
    detail: 'Attestation of policies, professionalism, and incident reporting',
    status: 'Pending',
    meta: 'Due Apr 30, 2026',
  },
]

function statusClass(status: ComplianceRequirement['status']) {
  if (status === 'Complete') return 'portal-status portal-status--paid'
  if (status === 'Pending') return 'portal-status portal-status--pending'
  return 'portal-status portal-status--expiring'
}

export function ClinicalCompliancePage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Compliance</h2>
      <p className="portal-page-lede">
        Health-professions training requires current documentation before you may enter patient care
        settings. Keep these items up to date; expired or missing records can delay rotation starts or
        affiliate access.
      </p>
      <section className="portal-module-panel" aria-labelledby="compliance-list-heading">
        <h3 id="compliance-list-heading" className="portal-module-panel-heading">
          Requirements
        </h3>
        <ul className="portal-registration-status-list">
          {REQUIREMENTS.map((row) => (
            <li key={row.id} className="portal-registration-status-item portal-clinical-compliance-item">
              <div>
                <p className="portal-registration-status-label">{row.title}</p>
                <p className="portal-registration-status-value portal-clinical-compliance-detail">{row.detail}</p>
                {row.meta ? (
                  <p className="portal-clinical-meta-line portal-clinical-meta-line--flush">{row.meta}</p>
                ) : null}
              </div>
              <span className={statusClass(row.status)}>{row.status}</span>
            </li>
          ))}
        </ul>
      </section>
      <p className="portal-inline-note">
        Upload and renewal workflows will connect to student health and the compliance portal in a future
        release. Contact your clinical coordinator if a site requests additional affiliate-specific training.
      </p>
    </main>
  )
}
