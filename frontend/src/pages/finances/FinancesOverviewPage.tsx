import { AccountingLedgerSection } from './AccountingLedgerSection'
import { useStudentPortalT } from '@/LanguageContext'

export function FinancesOverviewPage() {
  const t = useStudentPortalT()

  return (
    <main className="portal-page portal-stack portal-finances-overview">
      <h1 className="portal-page-title portal-finances-overview__title">{t('makePayment')}</h1>
      <AccountingLedgerSection />
    </main>
  )
}
