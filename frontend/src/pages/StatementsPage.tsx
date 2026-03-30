import { PageLayout } from '../components/PageLayout'
import { useAccount } from '../context/AccountContext'
import { INSTITUTION_NAME } from '../branding'
import { portalTermLabel } from '../lib/accountDisplay'
import { formatMoney } from '../lib/formatMoney'

function formatStatementDate(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function StatementsPage() {
  const { account } = useAccount()
  const termLabel = portalTermLabel(account)

  return (
    <PageLayout>
      <main className="portal-page">
        <p className="portal-page-lede">
          Recent billing statements for your student tuition account at {INSTITUTION_NAME}. Listing uses
          your current term ({termLabel}) and program on file.
        </p>

        <div className="portal-table-wrap">
          <table className="portal-table portal-table--statements">
            <caption className="visually-hidden">
              Recent tuition billing statements
            </caption>
            <thead>
              <tr>
                <th scope="col">Statement Date</th>
                <th scope="col">Description</th>
                <th scope="col">Balance</th>
                <th scope="col">Term</th>
                <th scope="col">View</th>
                <th scope="col">Download</th>
              </tr>
            </thead>
            <tbody>
              {account.statements.map((stmt) => (
                <tr key={`${stmt.statementDate}-${stmt.description}`}>
                  <td>{formatStatementDate(stmt.statementDate)}</td>
                  <td>{stmt.description}</td>
                  <td>{formatMoney(stmt.balance)}</td>
                  <td>{termLabel}</td>
                  <td>
                    <button type="button" className="portal-btn portal-btn--secondary portal-btn--compact">
                      View
                    </button>
                  </td>
                  <td>
                    <button type="button" className="portal-btn portal-btn--secondary portal-btn--compact">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="portal-inline-note">
          Only the most recent statement is shown here. Previous statements are available upon request from
          the bursar&apos;s office.
        </p>
      </main>
    </PageLayout>
  )
}
