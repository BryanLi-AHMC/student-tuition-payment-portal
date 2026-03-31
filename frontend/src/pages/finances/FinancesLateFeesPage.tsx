import { Link } from 'react-router-dom'
import { useAccount } from '../../context/AccountContext'
import { portalTermLabel } from '../../lib/accountDisplay'
import { formatMoney } from '../../lib/formatMoney'

export function FinancesLateFeesPage() {
  const { account } = useAccount()
  const termLabel = portalTermLabel(account)
  const lateRows = account.lineItems.filter((row) => /late fee/i.test(row.description))

  return (
    <main className="portal-page">
      <p className="portal-page-lede">
        Posted late fees for {termLabel}. Amounts match your itemized charges and the account summary.
        Contact the bursar if you believe a fee was applied in error.
      </p>

      {lateRows.length > 0 ? (
        <section className="portal-card portal-stack" aria-labelledby="late-fees-heading">
          <h2 id="late-fees-heading" className="portal-section-heading">
            Late fees on record
          </h2>
          <div className="portal-table-wrap">
            <table className="portal-table portal-table--courses">
              <caption className="visually-hidden">Posted late fees for the current term</caption>
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lateRows.map((row, index) => (
                  <tr key={`${index}-${row.description}`}>
                    <td>{row.description}</td>
                    <td className="portal-table-cell-capitalize">{row.category}</td>
                    <td>{formatMoney(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="portal-card portal-stack" aria-labelledby="late-fees-heading">
          <h2 id="late-fees-heading" className="portal-section-heading">
            Late fees
          </h2>
          <p className="portal-inline-note portal-inline-note--flush">
            No late fees are posted for this term. Keep your installment schedule to avoid future late
            fees.
          </p>
        </section>
      )}

      <p className="portal-inline-note">
        For the full account picture, see{' '}
        <Link className="portal-text-link" to="/finances/overview">
          Account Summary
        </Link>
        .
      </p>
    </main>
  )
}
