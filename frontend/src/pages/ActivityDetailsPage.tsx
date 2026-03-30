import { PageLayout } from '../components/PageLayout'
import { useAccount } from '../context/AccountContext'
import { INSTITUTION_NAME } from '../branding'
import { activityRowsFromRecent } from '../lib/accountDisplay'
import { formatMoney } from '../lib/formatMoney'

export function ActivityDetailsPage() {
  const { account } = useAccount()
  const rows = activityRowsFromRecent(account.recentActivity)

  return (
    <PageLayout>
      <main className="portal-page">
        <p className="portal-page-lede">
          Recent posted activity for your student tuition account at {INSTITUTION_NAME}. Figures are
          derived from the same MAHM demo ledger as your account overview; official statements are issued
          by the bursar.
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
              {rows.map((row, i) => (
                <tr key={`${i}-${row.date}-${row.description}`}>
                  <td>{row.date}</td>
                  <td>{row.description}</td>
                  <td>{row.charges ? formatMoney(row.charges) : '—'}</td>
                  <td>{row.credits ? formatMoney(row.credits) : '—'}</td>
                  <td>{formatMoney(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </PageLayout>
  )
}
