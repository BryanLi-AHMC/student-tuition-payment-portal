import { PageLayout } from '../components/PageLayout'
import { INSTITUTION_NAME } from '../branding'

const ACTIVITY_ROWS = [
  {
    date: 'Jul 10, 2026',
    description: 'Tuition — Fall 2026 (MD program)',
    charges: '$18,200.00',
    credits: '—',
    balance: '$18,200.00',
  },
  {
    date: 'Sep 29, 2026',
    description: 'Late fee — account past due (2 weeks)',
    charges: '$200.00',
    credits: '—',
    balance: '$18,400.00',
  },
] as const

export function ActivityDetailsPage() {
  return (
    <PageLayout title="Activity Details">
      <main className="portal-page">
        <p className="portal-page-lede">
          Recent posted activity for your student tuition account at {INSTITUTION_NAME}. Figures
          are illustrative for this preview; your official ledger and statements are issued by the
          bursar.
        </p>

        <div className="portal-table-wrap">
          <table className="portal-table portal-table--activity">
            <caption className="visually-hidden">
              Recent tuition account activity
            </caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Charges</th>
                <th scope="col">Credits</th>
                <th scope="col">Balance</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_ROWS.map((row) => (
                <tr key={`${row.date}-${row.description}`}>
                  <td>{row.date}</td>
                  <td>{row.description}</td>
                  <td>{row.charges}</td>
                  <td>{row.credits}</td>
                  <td>{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </PageLayout>
  )
}
