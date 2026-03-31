import { DASHBOARD_COURSES_MOCK } from './dashboardMockData'

type Props = {
  termLabel: string
}

export function DashboardCoursesWidget({ termLabel }: Props) {
  return (
    <section className="portal-dashboard-courses" aria-labelledby="portal-dashboard-courses-heading">
      <header className="portal-dashboard-courses-head">
        <div className="portal-dashboard-courses-head-text">
          <h2 id="portal-dashboard-courses-heading" className="portal-dashboard-section-title">
            My Courses
          </h2>
          <p className="portal-dashboard-courses-term">{termLabel}</p>
        </div>
      </header>

      <div className="portal-dashboard-courses-table-wrap">
        <table className="portal-dashboard-courses-table">
          <thead>
            <tr>
              <th scope="col">Course</th>
              <th scope="col">Title</th>
              <th scope="col">Cr.</th>
              <th scope="col">Section</th>
              <th scope="col">Schedule</th>
              <th scope="col">Location</th>
            </tr>
          </thead>
          <tbody>
            {DASHBOARD_COURSES_MOCK.map((c) => (
              <tr key={c.id}>
                <td className="portal-dashboard-courses-code">{c.code}</td>
                <td className="portal-dashboard-courses-title-cell">{c.title}</td>
                <td className="portal-dashboard-courses-credits">{c.credits}</td>
                <td className="portal-dashboard-courses-section">{c.section}</td>
                <td className="portal-dashboard-courses-schedule">{c.schedule}</td>
                <td className="portal-dashboard-courses-location">{c.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="portal-dashboard-courses-footnote">
        Schedule and enrollment are illustrative. Confirm details in Registration or Academics.
      </p>
    </section>
  )
}
