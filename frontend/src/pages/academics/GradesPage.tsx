const SAMPLE_COURSES = [
  {
    code: 'MED 510',
    title: 'Human Structure & Function',
    term: 'Fall 2025',
    grade: 'A',
    credits: 4,
  },
  {
    code: 'MED 520',
    title: 'Foundations of Clinical Practice',
    term: 'Fall 2025',
    grade: 'A-',
    credits: 3,
  },
  {
    code: 'MED 505',
    title: 'Biochemistry for Medicine',
    term: 'Fall 2025',
    grade: 'B+',
    credits: 2,
  },
  {
    code: 'MED 480',
    title: 'Introduction to Medical Ethics',
    term: 'Summer 2025',
    grade: 'A',
    credits: 1,
  },
] as const

export function GradesPage() {
  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">Grades</h2>
      <p className="portal-page-lede">
        Listed below are sample courses for demonstration. When connected to your student information system,
        this page will reflect your official graded coursework by term.
      </p>
      <div className="portal-table-wrap">
        <table className="portal-table portal-table--grades">
          <thead>
            <tr>
              <th scope="col">Course</th>
              <th scope="col">Title</th>
              <th scope="col">Term</th>
              <th scope="col">Credits</th>
              <th scope="col">Grade</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_COURSES.map((row) => (
              <tr key={`${row.code}-${row.term}`}>
                <td>{row.code}</td>
                <td>{row.title}</td>
                <td>{row.term}</td>
                <td>{row.credits}</td>
                <td>
                  <span className="portal-status">{row.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
