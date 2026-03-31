const CLINIC_SESSIONS = [
  {
    date: 'Mon, Apr 6, 2026',
    session: 'Ambulatory — Week 4',
    site: 'University Medical Group — East Clinic',
    faculty: 'Dr. Jordan Ellis, MD',
    status: 'Confirmed',
  },
  {
    date: 'Wed, Apr 8, 2026',
    session: 'Ambulatory — Week 4',
    site: 'University Medical Group — East Clinic',
    faculty: 'Dr. Jordan Ellis, MD',
    status: 'Confirmed',
  },
  {
    date: 'Fri, Apr 10, 2026',
    session: 'Procedure lab orientation',
    site: 'Clinical Skills Center',
    faculty: 'Dr. Samira Okonkwo, MD',
    status: 'Tentative',
  },
  {
    date: 'Mon, Apr 13, 2026',
    session: 'Inpatient — Team A',
    site: 'Regional Health — Internal Medicine',
    faculty: 'Dr. Miguel Santos, MD',
    status: 'Pending approval',
  },
] as const

export function ClinicalSchedulePage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Clinic schedule</h2>
      <p className="portal-page-lede">
        Your published clinic and rotation assignments appear below. Supervisors and sites may update as
        the term approaches—check back for the official schedule released by the clinical affairs office.
      </p>
      <section className="portal-module-panel" aria-labelledby="clinic-schedule-table-heading">
        <h3 id="clinic-schedule-table-heading" className="portal-module-panel-heading">
          Upcoming assignments
        </h3>
        <div className="portal-table-wrap">
          <table className="portal-table portal-table--clinical-schedule">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Session</th>
                <th scope="col">Clinic / site</th>
                <th scope="col">Supervising faculty</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {CLINIC_SESSIONS.map((row) => (
                <tr key={`${row.date}-${row.session}`}>
                  <td>{row.date}</td>
                  <td>{row.session}</td>
                  <td>{row.site}</td>
                  <td>{row.faculty}</td>
                  <td>
                    <span
                      className={
                        row.status === 'Confirmed'
                          ? 'portal-status portal-status--paid'
                          : row.status === 'Tentative'
                            ? 'portal-status portal-status--upcoming'
                            : 'portal-status portal-status--pending'
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
