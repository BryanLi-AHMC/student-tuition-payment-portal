import { PageLayout } from '../components/PageLayout'
import { INSTITUTION_NAME } from '../branding'

type StatementBadge = 'new' | 'updated' | null

type StatementRow = {
  id: string
  statementDate: string
  description: string
  term: string
  badge?: StatementBadge
}

const STATEMENT_ROWS: StatementRow[] = [
  {
    id: '1',
    statementDate: 'Aug 15, 2026',
    description: `Fall 2026 Tuition Statement — ${INSTITUTION_NAME}`,
    term: 'Fall 2026',
    badge: 'new',
  },
]

function StatementBadgeLabel({ kind }: { kind: StatementBadge }) {
  if (!kind) return null
  if (kind === 'new') {
    return <span className="portal-statements-badge portal-statements-badge--new">New</span>
  }
  return <span className="portal-statements-badge portal-statements-badge--updated">Updated</span>
}

export function StatementsPage() {
  return (
    <PageLayout>
      <main className="portal-page">
        <p className="portal-page-lede">
          Recent billing statements for your student tuition account at {INSTITUTION_NAME}.
          Documents listed are illustrative for this preview; official statements are issued by
          the bursar.
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
                <th scope="col">Term</th>
                <th scope="col">View</th>
                <th scope="col">Download</th>
              </tr>
            </thead>
            <tbody>
              {STATEMENT_ROWS.map((row) => (
                <tr key={row.id}>
                  <td>{row.statementDate}</td>
                  <td>
                    {row.description}
                    {row.badge ? (
                      <>
                        {' '}
                        <StatementBadgeLabel kind={row.badge} />
                      </>
                    ) : null}
                  </td>
                  <td>{row.term}</td>
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
          Only the most recent statement is shown here. Previous statements are available upon request
          from the bursar&apos;s office.
        </p>
      </main>
    </PageLayout>
  )
}
