type FormRow = {
  id: string
  title: string
  office: string
  description: string
  actionLabel: 'Download' | 'Open Form'
}

const REGISTRATION: readonly FormRow[] = [
  {
    id: 'reg-add-drop',
    title: 'Add / Drop Request',
    office: 'Office of the Registrar',
    description: 'Term add/drop with advisor approval when required by your program.',
    actionLabel: 'Open Form',
  },
  {
    id: 'reg-leave',
    title: 'Leave of Absence',
    office: 'Office of the Registrar',
    description: 'Request a leave and understand return conditions and timeline.',
    actionLabel: 'Download',
  },
]

const FINANCIAL: readonly FormRow[] = [
  {
    id: 'fin-plan',
    title: 'Payment Plan Election',
    office: 'Student Financial Services',
    description: 'Enroll in an installment plan for the current academic year.',
    actionLabel: 'Open Form',
  },
  {
    id: 'fin-aid',
    title: 'Financial Aid Appeal',
    office: 'Financial Aid',
    description: 'Special circumstance appeal with supporting documentation checklist.',
    actionLabel: 'Download',
  },
]

const CLINICAL: readonly FormRow[] = [
  {
    id: 'clin-site',
    title: 'Clinical Site Preference',
    office: 'Clinical Education',
    description: 'Rank site preferences for upcoming rotation blocks (subject to availability).',
    actionLabel: 'Open Form',
  },
  {
    id: 'clin-incident',
    title: 'Clinical Incident Report',
    office: 'Clinical Education',
    description: 'Report patient safety or professionalism incidents per affiliate policy.',
    actionLabel: 'Download',
  },
]

const GENERAL: readonly FormRow[] = [
  {
    id: 'gen-name',
    title: 'Legal Name Change',
    office: 'Student Services',
    description: 'Update your legal name on record with court order or government ID.',
    actionLabel: 'Download',
  },
  {
    id: 'gen-address',
    title: 'Address & Contact Update',
    office: 'Student Services',
    description: 'Mailing, permanent, and emergency contact updates.',
    actionLabel: 'Open Form',
  },
]

function FormSection({
  headingId,
  title,
  forms,
}: {
  headingId: string
  title: string
  forms: readonly FormRow[]
}) {
  return (
    <section className="portal-module-panel portal-documents-panel-stack" aria-labelledby={headingId}>
      <h3 id={headingId} className="portal-documents-section-heading">
        {title}
      </h3>
      <ul className="portal-documents-item-list">
        {forms.map((f) => (
          <li key={f.id} className="portal-documents-item portal-documents-item--forms">
            <div className="portal-documents-item-main">
              <p className="portal-documents-item-title">{f.title}</p>
              <p className="portal-documents-item-office">{f.office}</p>
              <p className="portal-documents-item-desc">{f.description}</p>
            </div>
            <button type="button" className="portal-btn portal-btn--secondary portal-btn--compact">
              {f.actionLabel}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function DocumentsFormsPage() {
  return (
    <main className="portal-page portal-documents-page-stack">
      <h2 className="portal-section-heading">Forms</h2>
      <p className="portal-page-lede">
        Download PDFs or open web forms by office. Use the correct form for your situation; incomplete or
        outdated versions may delay processing.
      </p>
      <FormSection headingId="forms-reg-heading" title="Registration forms" forms={REGISTRATION} />
      <FormSection headingId="forms-fin-heading" title="Financial forms" forms={FINANCIAL} />
      <FormSection headingId="forms-clin-heading" title="Clinical forms" forms={CLINICAL} />
      <FormSection headingId="forms-gen-heading" title="General student forms" forms={GENERAL} />
      <p className="portal-inline-note portal-inline-note--flush">
        Electronic submission and routing will integrate with student services workflows in a future release.
        For urgent requests, follow your program's email instructions and include your student ID.
      </p>
    </main>
  )
}
