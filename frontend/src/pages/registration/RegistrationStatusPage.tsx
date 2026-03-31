export function RegistrationStatusPage() {
  return (
    <main className="portal-page">
      <p className="portal-page-lede">
        Summary of how registration works for you right now. Values below are sample placeholders until
        your student record API is wired in.
      </p>
      <ul className="portal-registration-status-list" aria-label="Registration status">
        <li className="portal-registration-status-item">
          <div>
            <p className="portal-registration-status-label">Registration window</p>
            <p className="portal-registration-status-value">Open</p>
            <p className="portal-registration-status-note">Example: through Friday, 5:00 p.m.</p>
          </div>
          <span className="portal-registration-status-badge">Open</span>
        </li>
        <li className="portal-registration-status-item">
          <div>
            <p className="portal-registration-status-label">Holds</p>
            <p className="portal-registration-status-value">No active registration holds</p>
            <p className="portal-registration-status-note">
              Financial, immunization, or other holds would appear here with links to resolution steps.
            </p>
          </div>
          <span className="portal-registration-status-badge portal-registration-status-badge--neutral">
            Clear
          </span>
        </li>
        <li className="portal-registration-status-item">
          <div>
            <p className="portal-registration-status-label">Advisor approval</p>
            <p className="portal-registration-status-value">Not required — example</p>
            <p className="portal-registration-status-note">
              When required, status will show pending, approved, or denied with the advisor of record.
            </p>
          </div>
          <span className="portal-registration-status-badge portal-registration-status-badge--neutral">
            N/A
          </span>
        </li>
        <li className="portal-registration-status-item">
          <div>
            <p className="portal-registration-status-label">Registered credits</p>
            <p className="portal-registration-status-value">12 credits — example</p>
            <p className="portal-registration-status-note">Full-time minimum is typically 12 credits.</p>
          </div>
          <span className="portal-registration-status-badge">12 cr.</span>
        </li>
      </ul>
    </main>
  )
}
