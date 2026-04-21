import { useEffect, useState } from 'react'
import { useStudentPortalT } from '@/LanguageContext'
import { useAccount } from '../../context/AccountContext'
import {
  fetchStudentClinicalProgress,
  type StudentClinicalProgressResponse,
} from '../../lib/api'

export function ClinicalProgressPage() {
  const t = useStudentPortalT()
  const { currentStudentId } = useAccount()
  const sid = currentStudentId?.trim() ?? ''

  const [data, setData] = useState<StudentClinicalProgressResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sid) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchStudentClinicalProgress(sid)
        if (!cancelled) setData(res)
      } catch (e) {
        if (!cancelled) {
          setData(null)
          setError(
            e instanceof Error ? e.message : t('clinicalProgressLoadError'),
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sid, t])

  const showEmptyAccount = !sid

  return (
    <main className="portal-page">
      <h2 className="portal-section-heading">{t('clinicalProgressNav')}</h2>
      <p className="portal-page-lede">{t('clinicalProgressLede')}</p>

      {showEmptyAccount ? (
        <p className="portal-page-lede" role="status">
          {t('clinicalSignInAddDrop')}
        </p>
      ) : null}

      {error ? (
        <p className="portal-page-lede" role="alert">
          {error}
        </p>
      ) : null}

      {!showEmptyAccount && loading ? (
        <p className="portal-page-lede" aria-live="polite">
          {t('clinicalProgressLoading')}
        </p>
      ) : null}

      {!showEmptyAccount && !loading && data ? (
        <>
          <section className="portal-stack" aria-label={t('clinicalProgressSummaryAria')}>
            <p className="portal-page-lede" style={{ marginBottom: '0.25rem' }}>
              {t('clinicalProgressSummaryCompleted')}{' '}
              <strong>{data.completedCount}</strong>
            </p>
            <p className="portal-page-lede">
              {t('clinicalProgressSummaryHours')}{' '}
              <strong>{data.totalHours}h</strong>
            </p>
          </section>

          <section className="portal-module-panel portal-stack" aria-labelledby="clinical-progress-table">
            <h3 id="clinical-progress-table" className="portal-module-panel-heading">
              {t('clinicalProgressRecordsHeading')}
            </h3>
            <div className="portal-table-wrap">
              <table className="portal-table portal-table--clinical-schedule">
                <thead>
                  <tr>
                    <th scope="col">{t('clinicalProgressColCourse')}</th>
                    <th scope="col">{t('clinicalProgressColTerm')}</th>
                    <th scope="col">{t('clinicalProgressColHours')}</th>
                    <th scope="col">{t('clinicalProgressColGrade')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <span className="portal-inline-note portal-inline-note--flush">
                          {t('clinicalProgressEmpty')}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    data.records.map((row, idx) => (
                      <tr key={`${row.code}-${row.term}-${row.year}-${idx}`}>
                        <td>{row.code}</td>
                        <td>
                          {row.term} {row.year}
                        </td>
                        <td>{row.hours}</td>
                        <td>{row.grade}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </main>
  )
}
