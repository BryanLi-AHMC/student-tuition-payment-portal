import { useMemo, type CSSProperties } from 'react'
import { formatDeliveryModeForDisplay } from '../../lib/deliveryMode'
import { formatTimeHmsForDisplay } from '../../lib/formatScheduleTime'
import {
  buildTimetablePlacedBlocksByDay,
  STUDENT_REGISTRATION_TIMETABLE_GRID,
  TIMETABLE_ROW_HEIGHT_PX,
  timetableBodyHeightPx,
} from '../../lib/timetableBlockLayout'
import type { WeekdayFull } from '../../lib/weekdaySchedule'
import { useCourseBin } from './CourseBinContext'
import { partitionCourseBinItemsForTimetable } from './courseBinSchedule'
import { useRegistrationTermSearchParam } from './registrationTermSearch'

const MY_GRID = STUDENT_REGISTRATION_TIMETABLE_GRID

const DAY_HEADERS: { full: WeekdayFull; label: string }[] = [
  { full: 'Monday', label: 'Monday' },
  { full: 'Tuesday', label: 'Tuesday' },
  { full: 'Wednesday', label: 'Wednesday' },
  { full: 'Thursday', label: 'Thursday' },
  { full: 'Friday', label: 'Friday' },
]

export function SchedulePage() {
  const registrationTermId = useRegistrationTermSearchParam()
  const { items } = useCourseBin()

  const { sections, unplaced } = useMemo(
    () => partitionCourseBinItemsForTimetable(items),
    [items],
  )

  const hourRows = useMemo(() => {
    const sh = MY_GRID.startHour ?? 8
    const eh = MY_GRID.endHour ?? 21
    return Array.from({ length: eh - sh + 1 }, (_, i) => sh + i)
  }, [])

  const placedByDayFull = useMemo(
    () => buildTimetablePlacedBlocksByDay(sections, MY_GRID),
    [sections],
  )

  const placedWeekdays = useMemo(
    () => placedByDayFull.slice(0, DAY_HEADERS.length),
    [placedByDayFull],
  )

  const bodyHeightPx = timetableBodyHeightPx(MY_GRID)

  const termMissing = registrationTermId == null || registrationTermId.trim() === ''

  return (
    <main
      className="portal-page portal-my-timetable-page"
      data-registration-term={registrationTermId ?? undefined}
    >
      <section className="portal-card portal-stack" aria-labelledby="timetable-heading">
        <h2 id="timetable-heading" className="portal-section-heading">
          My Timetable
        </h2>
        <p className="portal-text-muted" style={{ marginTop: 0 }}>
          Sections in your CourseBin for this term (Monday–Friday, 8:00 a.m.–9:00 p.m.). Add or remove
          sections from the Offered Timetable or My CourseBin.
        </p>

        {termMissing && (
          <p className="portal-text-muted" role="status">
            Select an academic term above to view your timetable.
          </p>
        )}

        {!termMissing && items.length === 0 && (
          <p className="portal-text-muted" role="status">
            Your CourseBin is empty. Add sections from the Offered Timetable to see them here.
          </p>
        )}

        {!termMissing && items.length > 0 && sections.length === 0 && (
          <p className="portal-text-muted" role="status">
            None of your CourseBin sections have a placeable weekly schedule (e.g. time or days are
            TBA). Check My CourseBin for details.
          </p>
        )}

        {!termMissing && sections.length > 0 && (
          <div className="admin-timetable-wrap">
            <div
              className="admin-timetable-v2 portal-my-timetable-v2"
              style={
                {
                  '--admin-tt-slot': `${TIMETABLE_ROW_HEIGHT_PX}px`,
                } as CSSProperties
              }
            >
              <div className="admin-timetable-v2__head">
                <div className="admin-timetable-v2__corner" aria-hidden />
                {DAY_HEADERS.map((d) => (
                  <div key={d.full} className="admin-timetable-v2__day-head">
                    {d.label}
                  </div>
                ))}
              </div>
              <div className="admin-timetable-v2__main">
                <div
                  className="admin-timetable-v2__times"
                  style={{ height: bodyHeightPx }}
                >
                  {hourRows.map((h) => (
                    <div key={h} className="admin-timetable-v2__time-cell">
                      {formatTimeHmsForDisplay(`${h}:00:00`)}
                    </div>
                  ))}
                </div>
                {DAY_HEADERS.map((d, di) => (
                  <div key={d.full} className="admin-timetable-v2__day-col">
                    <div
                      className="admin-timetable-v2__day-track"
                      style={{ height: bodyHeightPx }}
                    >
                      {placedWeekdays[di]!.map((b) => {
                        const colW = 100 / b.colCount
                        const insetPx = 3
                        return (
                          <div
                            key={`${b.section.id}-${d.full}-${b.startMin}-${b.colIndex}`}
                            className="admin-timetable-v2__block portal-my-timetable__block"
                            style={{
                              top: b.topPx,
                              height: b.heightPx,
                              left: `calc(${colW * b.colIndex}% + ${insetPx}px)`,
                              width: `calc(${colW}% - ${insetPx * 2}px)`,
                            }}
                            role="group"
                            aria-label={`${b.section.course_code} section ${b.section.section_code}`}
                          >
                            <span className="admin-timetable-v2__block-title">
                              {b.section.course_code} {b.section.section_code}
                            </span>
                            <span className="admin-timetable-v2__block-meta">
                              {formatTimeHmsForDisplay(b.section.start_time)} –{' '}
                              {formatTimeHmsForDisplay(b.section.end_time)}
                            </span>
                            {b.section.instructor?.trim() ? (
                              <span className="admin-timetable-v2__block-meta">
                                {b.section.instructor}
                              </span>
                            ) : null}
                            {b.section.room?.trim() ? (
                              <span className="admin-timetable-v2__block-meta">{b.section.room}</span>
                            ) : null}
                            {b.section.delivery_mode?.trim() ? (
                              <span className="admin-timetable-v2__block-meta">
                                {formatDeliveryModeForDisplay(b.section.delivery_mode)}
                              </span>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!termMissing && unplaced.length > 0 && (
          <div className="portal-my-timetable-unplaced portal-stack">
            <h3 className="portal-my-timetable-unplaced__title">Not shown on grid</h3>
            <p className="portal-text-muted" style={{ marginTop: 0 }}>
              These CourseBin entries do not have enough schedule detail to place on the timetable.
            </p>
            <ul className="portal-my-timetable-unplaced__list">
              {unplaced.map((u) => (
                <li key={`${u.course_code}|${u.section}`}>
                  <strong>{u.course_code.trim() || '—'}</strong>
                  {u.section.trim() ? ` · ${u.section}` : ''}
                  {u.time.trim() && u.time !== 'TBA' ? ` · ${u.time}` : ''}
                  {u.days.trim() && u.days !== 'TBA' ? ` · ${u.days}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  )
}
