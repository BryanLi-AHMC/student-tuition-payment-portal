import { Link } from 'react-router-dom'
import type { AdminCourseSection } from '../../lib/api'
import { formatDeliveryModeForDisplay } from '../../lib/deliveryMode'
import { formatTimeRangeHmsForDisplay } from '../../lib/formatScheduleTime'
import { formatWeekdaysLongFromStored } from '../../lib/weekdaySchedule'

type Props = {
  section: AdminCourseSection | null
  /** e.g. timetable column day, for context */
  dayColumnLabel?: string | null
  /** Resolved catalog label for selected term, if available */
  termCatalogLabel?: string | null
  onClose: () => void
}

function row(dt: string, dd: string) {
  return (
    <div>
      <dt>{dt}</dt>
      <dd>{dd}</dd>
    </div>
  )
}

export function AdminCourseSectionDetailModal({
  section,
  dayColumnLabel,
  termCatalogLabel,
  onClose,
}: Props) {
  if (section == null) return null

  const termLine =
    termCatalogLabel?.trim() ||
    [section.term, section.year].filter(Boolean).join(' ') ||
    '—'

  return (
    <div
      className="admin-section-detail-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="admin-section-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-section-detail-title"
      >
        <h2 id="admin-section-detail-title" className="admin-section-detail-modal__title">
          {section.course_code} · {section.section_code}
        </h2>
        {dayColumnLabel != null && dayColumnLabel !== '' && (
          <p className="admin-section-detail-modal__meta">
            Column: {dayColumnLabel}
          </p>
        )}
        <dl className="admin-section-detail-modal__dl">
          {row('Academic term', termLine)}
          {row('Weekdays', formatWeekdaysLongFromStored(section.weekday))}
          {row(
            'Time',
            formatTimeRangeHmsForDisplay(section.start_time, section.end_time),
          )}
          {row('Delivery mode', formatDeliveryModeForDisplay(section.delivery_mode))}
          {row('Room', section.room?.trim() ? section.room : '—')}
          {row('Instructor', section.instructor?.trim() ? section.instructor : '—')}
          {row('Notes', section.notes?.trim() ? section.notes : '—')}
        </dl>
        <div className="admin-section-detail-modal__actions">
          <Link
            to="/admin/course-sections"
            className="portal-btn portal-btn--secondary portal-btn--compact"
            onClick={onClose}
          >
            Course Sections
          </Link>
          <button
            type="button"
            className="portal-btn portal-btn--primary portal-btn--compact"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
