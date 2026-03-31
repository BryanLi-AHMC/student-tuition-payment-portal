type UploadRow = {
  id: string
  label: string
  detail: string
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Missing'
}

const UPLOADS: readonly UploadRow[] = [
  {
    id: 'imm',
    label: 'Immunization record',
    detail: 'Uploaded Mar 8, 2026 · PDF · 240 KB',
    status: 'Approved',
  },
  {
    id: 'bls',
    label: 'BLS certification',
    detail: 'Uploaded Feb 2, 2026 · PDF · 180 KB',
    status: 'Under Review',
  },
  {
    id: 'bg',
    label: 'Background check',
    detail: 'Vendor report on file',
    status: 'Approved',
  },
  {
    id: 'copyright',
    label: 'Signed Copyright Agreement',
    detail: 'Electronic acknowledgment · Spring 2026',
    status: 'Submitted',
  },
  {
    id: 'reg',
    label: 'Registration form',
    detail: 'Expected for add/drop window',
    status: 'Missing',
  },
]

function statusClass(status: UploadRow['status']) {
  switch (status) {
    case 'Approved':
      return 'portal-status portal-status--paid'
    case 'Under Review':
      return 'portal-status portal-status--pending'
    case 'Submitted':
      return 'portal-status portal-status--scheduled'
    case 'Missing':
    default:
      return 'portal-status portal-status--missing'
  }
}

export function DocumentsUploadsPage() {
  return (
    <main className="portal-page portal-documents-page-stack">
      <h2 className="portal-section-heading">Uploads & submissions</h2>
      <p className="portal-page-lede">
        Track files you have submitted for administrative, financial, or compliance purposes. This view
        focuses on documents and records—not the same as clinical requirement status on the Clinical module.
      </p>
      <section className="portal-module-panel" aria-labelledby="uploads-list-heading">
        <h3 id="uploads-list-heading" className="portal-module-panel-heading">
          Your documents
        </h3>
        <ul className="portal-registration-status-list">
          {UPLOADS.map((row) => (
            <li key={row.id} className="portal-registration-status-item portal-documents-upload-row">
              <div>
                <p className="portal-registration-status-label">{row.label}</p>
                <p className="portal-registration-status-value portal-documents-upload-detail">{row.detail}</p>
              </div>
              <span className={statusClass(row.status)}>{row.status}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="portal-documents-upload-cta" aria-labelledby="upload-cta-heading">
        <h3 id="upload-cta-heading" className="portal-documents-upload-cta-title">
          Submit a new file
        </h3>
        <p className="portal-documents-upload-cta-desc">
          Upload new documents when your program or an office requests them. Submission history will list
          versions and review notes once the upload service is connected.
        </p>
        <div className="portal-documents-upload-cta-actions">
          <button type="button" className="portal-btn portal-btn--primary" disabled>
            Upload New Document
          </button>
          <button type="button" className="portal-btn portal-btn--secondary" disabled>
            View Submission History
          </button>
        </div>
        <p className="portal-documents-upload-cta-note">
          These actions are disabled in this preview. They will open the document intake workflow in a future
          release.
        </p>
      </section>
    </main>
  )
}
