import { PageLayout } from '../components/PageLayout'

const courses = [
  { course: 'TCM 601 Foundations of Traditional Chinese Medicine', units: 4, tuition: '$4,800' },
  { course: 'TCM 615 Acupuncture Theory', units: 3, tuition: '$3,600' },
  { course: 'BIO 610 Human Anatomy', units: 4, tuition: '$4,800' },
  { course: 'CLN 620 Clinical Practice I', units: 3, tuition: '$3,600' },
] as const

export function StudentDashboardPage() {
  return (
    <PageLayout>
      <main className="portal-page">
        <p className="portal-page-lede">
          Review your current student account summary, outstanding balance, and Fall 2026 tuition
          details.
        </p>

        <section
          className="portal-card portal-stack portal-account-summary"
          aria-labelledby="account-summary-heading"
        >
          <h2 id="account-summary-heading" className="portal-section-heading">
            Student account summary
          </h2>
          <dl>
            <div className="portal-row">
              <dt>Program</dt>
              <dd>Doctor of Medicine (MD)</dd>
            </div>
            <div className="portal-row">
              <dt>Term</dt>
              <dd>Fall 2026</dd>
            </div>
            <div className="portal-row">
              <dt>Billing Status</dt>
              <dd>Active</dd>
            </div>
            <div className="portal-row">
              <dt>Tuition / Current Charges</dt>
              <dd>$18,200</dd>
            </div>
            <div className="portal-row portal-row--fee-warning">
              <dt>Late Fees</dt>
              <dd>$200</dd>
            </div>
            <div className="portal-row portal-payment-total portal-account-summary__balance">
              <dt>Total Outstanding Balance</dt>
              <dd>$18,400</dd>
            </div>
            <div className="portal-row">
              <dt>Next Due Date</dt>
              <dd>Sep 15, 2026</dd>
            </div>
            <div className="portal-row">
              <dt>Installment Plan</dt>
              <dd>4-installment plan active</dd>
            </div>
            <div className="portal-row">
              <dt>Last Account Update</dt>
              <dd>Aug 28, 2026</dd>
            </div>
          </dl>
        </section>

        <section className="portal-stack" aria-labelledby="tuition-summary-heading">
          <h2 id="tuition-summary-heading" className="portal-section-heading">
            Fall 2026 Tuition and Course Summary
          </h2>
          <div className="portal-table-wrap">
            <table className="portal-table portal-table--courses">
              <caption className="visually-hidden">
                Enrolled courses with units and tuition for Fall 2026
              </caption>
              <thead>
                <tr>
                  <th scope="col">Course</th>
                  <th scope="col">Units</th>
                  <th scope="col">Tuition</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((row) => (
                  <tr key={row.course}>
                    <td>{row.course}</td>
                    <td>{row.units}</td>
                    <td>{row.tuition}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total</th>
                  <td>14</td>
                  <td>$16,800</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </main>
    </PageLayout>
  )
}
