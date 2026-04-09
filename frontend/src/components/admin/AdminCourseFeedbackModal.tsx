import { useEffect, useState, type MouseEvent } from 'react'
import {
  fetchAdminCourseFeedback,
  type CourseFeedbackApiItem,
} from '../../lib/api'

const COURSE_FEEDBACK_QUESTIONS = [
  'Course content was clear and well organized.',
  'The instructor explained concepts effectively.',
  'The pace of the course was appropriate.',
  'Assignments and learning activities supported my learning.',
  'I would recommend this course to other students.',
] as const

function backdropMouseDown(
  e: MouseEvent<HTMLDivElement>,
  onClose: () => void,
) {
  if (e.target === e.currentTarget) onClose()
}

function formatSubmittedAt(iso: string | null | undefined): string {
  if (iso == null || iso === '') return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return '—'
  }
}

export function AdminCourseFeedbackModal({
  studentId,
  courseCode,
  term,
  year,
  onClose,
}: {
  studentId: string
  courseCode: string
  term: string
  year: number
  onClose: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [item, setItem] = useState<CourseFeedbackApiItem | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        const data = await fetchAdminCourseFeedback(
          {
            studentId,
            courseCode,
            term,
            year,
          },
          { signal: ac.signal },
        )
        if (ac.signal.aborted) return
        setItem(data)
        setError(null)
      } catch (e) {
        if (ac.signal.aborted) return
        setError(e instanceof Error ? e.message : 'Could not load feedback.')
        setItem(null)
      } finally {
        if (!ac.signal.aborted) setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [studentId, courseCode, term, year])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const titleId = 'admin-course-feedback-modal-title'
  const f = item

  const submittedAt = f?.submittedAt

  return (
    <div
      className="portal-course-feedback-modal-backdrop"
      onMouseDown={(e) => backdropMouseDown(e, onClose)}
      role="presentation"
    >
      <div
        className="portal-course-feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="portal-course-feedback-modal__title">
          Course feedback
        </h2>
        {loading ? (
          <p className="portal-card-note">Loading…</p>
        ) : error ? (
          <p className="portal-card-note portal-profile-state--error" role="alert">
            {error}
          </p>
        ) : !f ? (
          <p className="portal-card-note">No feedback submitted yet</p>
        ) : (
          <>
            <dl className="portal-course-feedback-modal__readonly-dl">
              <div className="portal-course-feedback-modal__readonly-row">
                <dt className="portal-course-feedback-modal__readonly-label">{COURSE_FEEDBACK_QUESTIONS[0]}</dt>
                <dd className="portal-course-feedback-modal__readonly-value">{f.q1Rating}</dd>
              </div>
              <div className="portal-course-feedback-modal__readonly-row">
                <dt className="portal-course-feedback-modal__readonly-label">{COURSE_FEEDBACK_QUESTIONS[1]}</dt>
                <dd className="portal-course-feedback-modal__readonly-value">{f.q2Rating}</dd>
              </div>
              <div className="portal-course-feedback-modal__readonly-row">
                <dt className="portal-course-feedback-modal__readonly-label">{COURSE_FEEDBACK_QUESTIONS[2]}</dt>
                <dd className="portal-course-feedback-modal__readonly-value">{f.q3Rating}</dd>
              </div>
              <div className="portal-course-feedback-modal__readonly-row">
                <dt className="portal-course-feedback-modal__readonly-label">{COURSE_FEEDBACK_QUESTIONS[3]}</dt>
                <dd className="portal-course-feedback-modal__readonly-value">{f.q4Rating}</dd>
              </div>
              <div className="portal-course-feedback-modal__readonly-row">
                <dt className="portal-course-feedback-modal__readonly-label">{COURSE_FEEDBACK_QUESTIONS[4]}</dt>
                <dd className="portal-course-feedback-modal__readonly-value">{f.q5Rating}</dd>
              </div>
              <div className="portal-course-feedback-modal__readonly-row portal-course-feedback-modal__readonly-row--summary-first">
                <dt className="portal-course-feedback-modal__readonly-label">Overall rating</dt>
                <dd className="portal-course-feedback-modal__readonly-value">{f.overallRating}</dd>
              </div>
              <div className="portal-course-feedback-modal__readonly-row portal-course-feedback-modal__readonly-row--multiline">
                <dt className="portal-course-feedback-modal__readonly-label">Additional comments</dt>
                <dd className="portal-course-feedback-modal__readonly-value">
                  {f.comment != null && f.comment.trim() !== '' ? f.comment : '—'}
                </dd>
              </div>
            </dl>
            <div
              className="portal-course-feedback-modal__submitted-row"
              role="group"
              aria-label="Submitted at"
            >
              <span className="portal-course-feedback-modal__submitted-label">Submitted:</span>
              <span className="portal-course-feedback-modal__submitted-value">
                {formatSubmittedAt(submittedAt)}
              </span>
            </div>
          </>
        )}
        <div className="portal-course-feedback-modal__actions">
          <button
            type="button"
            className="portal-btn portal-btn--secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
