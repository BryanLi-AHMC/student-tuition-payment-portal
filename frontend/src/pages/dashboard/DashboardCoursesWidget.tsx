import { useState, type CSSProperties } from 'react'
import { DASHBOARD_COURSES_MOCK, DASHBOARD_WEEKLY_TIMETABLE_MOCK } from './dashboardMockData'
import type { WeeklyTimetableBlock } from './dashboardMockData'

type CalendarView = 'list' | 'week'

const WEEKDAY_ORDER = [
  { key: 'monday' as const, label: 'Monday' },
  { key: 'tuesday' as const, label: 'Tuesday' },
  { key: 'wednesday' as const, label: 'Wednesday' },
  { key: 'thursday' as const, label: 'Thursday' },
  { key: 'friday' as const, label: 'Friday' },
]

/** Grid covers 8:00 AM–6:00 PM so sessions ending after 5:00 PM still fit. */
const TIMETABLE_GRID_START_MIN = 8 * 60
const TIMETABLE_GRID_END_MIN = 18 * 60
const TIMETABLE_GRID_TOTAL_MIN = TIMETABLE_GRID_END_MIN - TIMETABLE_GRID_START_MIN

const TIMETABLE_TIME_LABELS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
] as const

/**
 * Split free-text location into building/place (line 1) and room/suite/virtual detail (line 2).
 * Handles trailing room numbers, trailing "Suite", and parenthetical qualifiers (e.g. synchronous virtual).
 */
function splitLocationDisplay(raw: string): { line1: string; line2: string } {
  const s = raw.trim()
  if (!s) return { line1: '', line2: '' }

  const paren = s.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  if (paren) {
    return { line1: paren[1]!.trim(), line2: `(${paren[2]!})` }
  }

  const words = s.split(/\s+/)
  if (words.length >= 2) {
    const last = words[words.length - 1]!
    if (/^\d+[A-Za-z]?$/.test(last)) {
      return { line1: words.slice(0, -1).join(' '), line2: last }
    }
    if (last.toLowerCase() === 'suite') {
      return { line1: words.slice(0, -1).join(' '), line2: last }
    }
  }

  return { line1: s, line2: '' }
}

function LocationCell({ location }: { location: string }) {
  const { line1, line2 } = splitLocationDisplay(location)
  return (
    <div className="portal-dashboard-courses-location-stack">
      <span className="portal-dashboard-courses-location-building">{line1}</span>
      {line2 ? <span className="portal-dashboard-courses-location-detail">{line2}</span> : null}
    </div>
  )
}

/**
 * Parse meeting text into card blocks: days (line 1) + time range (line 2).
 * Semicolons separate distinct meeting patterns (e.g. Mon/Thu blocks).
 */
function parseScheduleBlocks(schedule: string): { line1: string; line2: string }[] {
  const parts = schedule
    .split(/\s*;\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
  const timeTail = /^(.+?),\s*(\d{1,2}:\d{2}\s*(?:AM|PM)\s*[–-]\s*\d{1,2}:\d{2}\s*(?:AM|PM))\s*$/i
  const blocks: { line1: string; line2: string }[] = []
  for (const part of parts) {
    const m = part.match(timeTail)
    if (m) {
      blocks.push({ line1: m[1]!.trim(), line2: m[2]!.trim() })
    } else {
      blocks.push({ line1: part, line2: '' })
    }
  }
  return blocks.length ? blocks : [{ line1: schedule.trim(), line2: '' }]
}

function ScheduleCell({ schedule }: { schedule: string }) {
  const blocks = parseScheduleBlocks(schedule)
  return (
    <div className="portal-dashboard-courses-schedule-stack">
      {blocks.map((b, i) => (
        <div key={i} className="portal-dashboard-courses-schedule-block">
          <span className="portal-dashboard-courses-schedule-day">{b.line1}</span>
          {b.line2 ? <span className="portal-dashboard-courses-schedule-time">{b.line2}</span> : null}
        </div>
      ))}
    </div>
  )
}

function blockLayoutStyle(b: WeeklyTimetableBlock): CSSProperties {
  const start = Math.max(b.startMinutes, TIMETABLE_GRID_START_MIN)
  const end = Math.min(b.endMinutes, TIMETABLE_GRID_END_MIN)
  const topPct = ((start - TIMETABLE_GRID_START_MIN) / TIMETABLE_GRID_TOTAL_MIN) * 100
  const heightPct = Math.max(((end - start) / TIMETABLE_GRID_TOTAL_MIN) * 100, 2.5)
  return {
    top: `${topPct}%`,
    height: `${heightPct}%`,
  }
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WeekGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18M9 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function DashboardCoursesWidget() {
  const [view, setView] = useState<CalendarView>('list')

  return (
    <section className="portal-dashboard-courses" aria-labelledby="portal-dashboard-courses-heading">
      <header className="portal-dashboard-courses-head">
        <h2 id="portal-dashboard-courses-heading" className="portal-dashboard-card-panel-title">
          My Calendar
        </h2>
        <div
          className="portal-dashboard-courses-view-tabs"
          role="tablist"
          aria-label="Calendar view"
        >
          <button
            type="button"
            role="tab"
            className="portal-dashboard-courses-view-tab"
            aria-selected={view === 'list'}
            id="portal-dashboard-calendar-tab-courses"
            onClick={() => setView('list')}
          >
            <ListIcon className="portal-dashboard-courses-view-tab-icon" />
            <span>Courses</span>
          </button>
          <button
            type="button"
            role="tab"
            className="portal-dashboard-courses-view-tab"
            aria-selected={view === 'week'}
            id="portal-dashboard-calendar-tab-week"
            onClick={() => setView('week')}
          >
            <WeekGridIcon className="portal-dashboard-courses-view-tab-icon" />
            <span>Week</span>
          </button>
        </div>
      </header>

      {view === 'list' ? (
        <div className="portal-dashboard-courses-table-wrap">
          <table className="portal-dashboard-courses-table">
            <colgroup>
              <col className="portal-dashboard-courses-col-course" />
              <col className="portal-dashboard-courses-col-title" />
              <col className="portal-dashboard-courses-col-schedule" />
              <col className="portal-dashboard-courses-col-location" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Course</th>
                <th scope="col">Title</th>
                <th scope="col">Schedule</th>
                <th scope="col">Location</th>
              </tr>
            </thead>
            <tbody>
              {DASHBOARD_COURSES_MOCK.map((c) => (
                <tr key={c.id}>
                  <td className="portal-dashboard-courses-code">
                    <span className="portal-dashboard-courses-course-code">{c.code}</span>
                  </td>
                  <td className="portal-dashboard-courses-title-cell">
                    <span className="portal-dashboard-courses-title-text">{c.title}</span>
                  </td>
                  <td className="portal-dashboard-courses-schedule">
                    <ScheduleCell schedule={c.schedule} />
                  </td>
                  <td className="portal-dashboard-courses-location">
                    <LocationCell location={c.location} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="portal-dashboard-courses-timetable-wrap"
          role="region"
          aria-label="Weekly timetable"
        >
          <div className="portal-dashboard-courses-timetable">
            <div className="portal-dashboard-courses-timetable-corner" aria-hidden />
            {WEEKDAY_ORDER.map(({ key, label }) => (
              <div key={key} className="portal-dashboard-courses-timetable-dayhead">
                {label}
              </div>
            ))}
            <div className="portal-dashboard-courses-timetable-timecol" aria-hidden>
              {TIMETABLE_TIME_LABELS.map((t) => (
                <span key={t} className="portal-dashboard-courses-timetable-time-label">
                  {t}
                </span>
              ))}
            </div>
            {WEEKDAY_ORDER.map(({ key }) => {
              const blocks = DASHBOARD_WEEKLY_TIMETABLE_MOCK[key]
              return (
                <div key={key} className="portal-dashboard-courses-timetable-daycol">
                  <div className="portal-dashboard-courses-timetable-track">
                    {blocks.map((b, i) => (
                      <div
                        key={`${key}-${b.code}-${i}`}
                        className="portal-dashboard-courses-timetable-block"
                        style={blockLayoutStyle(b)}
                        aria-label={`${b.code}, ${b.time}`}
                      >
                        <span className="portal-dashboard-courses-timetable-code">{b.code}</span>
                        {b.subtitle ? (
                          <span className="portal-dashboard-courses-timetable-subtitle">{b.subtitle}</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
