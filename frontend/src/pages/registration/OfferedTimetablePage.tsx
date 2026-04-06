import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  fetchAdminCourseSections,
  fetchApiJson,
  type AdminCourseSection,
} from '../../lib/api'
import { formatDeliveryModeForDisplay } from '../../lib/deliveryMode'
import { formatTimeHmsForDisplay, formatTimeRangeHmsForDisplay } from '../../lib/formatScheduleTime'
import {
  buildTimetablePlacedBlocksByDay,
  TIMETABLE_ROW_HEIGHT_PX,
  timetableBodyHeightPx,
  type TimetableGridOptions,
} from '../../lib/timetableBlockLayout'
import {
  formatWeekdaysShortFromStored,
  type WeekdayFull,
} from '../../lib/weekdaySchedule'
import { useCourseBin, type CourseBinItem } from './CourseBinContext'
import { useRegistrationTermSearchParam } from './registrationTermSearch'

/** Student view: weekdays only, 08:00–18:59 visible (rows 8–18). */
const OFFERED_GRID: TimetableGridOptions = { startHour: 8, endHour: 18 }

const DAY_HEADERS: { full: WeekdayFull; label: string }[] = [
  { full: 'Monday', label: 'Monday' },
  { full: 'Tuesday', label: 'Tuesday' },
  { full: 'Wednesday', label: 'Wednesday' },
  { full: 'Thursday', label: 'Thursday' },
  { full: 'Friday', label: 'Friday' },
]

const PLACEHOLDER_REGISTERED = '0 of 0'

type CatalogCourse = {
  code: string | number | null | undefined
  eng_name: string | number | null | undefined
  chi_name: string | number | null | undefined
  units: string | number | null | undefined
}

function cellText(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function sessionLabelFromSection(sec: AdminCourseSection): string {
  const term = cellText(sec.term)
  const year = sec.year
  if (term === '' && (year === null || year === undefined || Number.isNaN(Number(year)))) {
    return '—'
  }
  if (term === '') return String(year)
  return `${term} ${year}`
}

/** Match Course Search CourseBin `type` (raw delivery_mode, not display label). */
function typeLabelForCourseBin(sec: AdminCourseSection): string {
  const d = cellText(sec.delivery_mode)
  return d === '' ? 'Lecture' : d
}

function adminSectionToCourseBinItem(
  sec: AdminCourseSection,
  catalog: CatalogCourse | undefined,
): CourseBinItem {
  const code = cellText(sec.course_code)
  const timeRaw = formatTimeRangeHmsForDisplay(sec.start_time, sec.end_time)
  const daysRaw = formatWeekdaysShortFromStored(sec.weekday)
  const instRaw = cellText(sec.instructor)
  const locRaw = cellText(sec.room)
  const secCode = cellText(sec.section_code)
  const eng = catalog ? cellText(catalog.eng_name) : ''
  const chi = catalog ? cellText(catalog.chi_name) : ''
  const unitsCat = catalog ? cellText(catalog.units) : ''
  return {
    course_code: code,
    eng_name: eng === '' ? code : eng,
    chi_name: chi,
    units: unitsCat === '' ? '—' : unitsCat,
    section: secCode === '' ? '—' : secCode,
    session: sessionLabelFromSection(sec),
    type: typeLabelForCourseBin(sec),
    registered: PLACEHOLDER_REGISTERED,
    time: timeRaw === '—' ? 'TBA' : timeRaw,
    days: daysRaw === '—' ? 'TBA' : daysRaw,
    instructor: instRaw === '' ? 'TBA' : instRaw,
    location: locRaw === '' ? 'TBA' : locRaw,
  }
}

function binKey(courseCode: string, section: string): string {
  return `${courseCode.trim().toLowerCase()}|${section.trim().toLowerCase()}`
}

function isSectionInBin(items: CourseBinItem[], sec: AdminCourseSection): boolean {
  const k = binKey(sec.course_code, sec.section_code)
  return items.some((x) => binKey(x.course_code, x.section) === k)
}

export function OfferedTimetablePage() {
  const registrationTermId = useRegistrationTermSearchParam()
  const { items: binItems, addToCourseBin } = useCourseBin()
  const [sections, setSections] = useState<AdminCourseSection[] | null>(null)
  const [catalog, setCatalog] = useState<CatalogCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(message)
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, 2800)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    void (async () => {
      try {
        const data: unknown = await fetchApiJson('/api/courses', { signal: ac.signal })
        if (!Array.isArray(data)) {
          throw new Error('Unexpected course catalog response.')
        }
        if (!ac.signal.aborted) {
          setCatalog(data as CatalogCourse[])
        }
      } catch (e) {
        if (ac.signal.aborted) return
        console.error('[offered-timetable] catalog load failed', e)
        setCatalog([])
      }
    })()
    return () => ac.abort()
  }, [])

  const catalogByCode = useMemo(() => {
    const m = new Map<string, CatalogCourse>()
    for (const c of catalog) {
      const code = cellText(c.code)
      if (code !== '') m.set(code.toUpperCase(), c)
    }
    return m
  }, [catalog])

  useEffect(() => {
    const tid = registrationTermId?.trim() ?? ''
    if (tid === '') {
      setSections([])
      setLoading(false)
      setError(null)
      return
    }
    const ac = new AbortController()
    setLoading(true)
    setError(null)
    void (async () => {
      try {
        const rows = await fetchAdminCourseSections({
          academicTermId: tid,
          signal: ac.signal,
        })
        if (ac.signal.aborted) return
        setSections(rows)
      } catch (e) {
        if (ac.signal.aborted) return
        setSections(null)
        setError(
          e instanceof Error ? e.message : 'Could not load the offered timetable.',
        )
      } finally {
        if (!ac.signal.aborted) setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [registrationTermId])

  const hourRows = useMemo(() => {
    const sh = OFFERED_GRID.startHour ?? 8
    const eh = OFFERED_GRID.endHour ?? 18
    return Array.from({ length: eh - sh + 1 }, (_, i) => sh + i)
  }, [])

  const placedByDayFull = useMemo(
    () => buildTimetablePlacedBlocksByDay(sections ?? [], OFFERED_GRID),
    [sections],
  )

  const placedWeekdays = useMemo(
    () => placedByDayFull.slice(0, DAY_HEADERS.length),
    [placedByDayFull],
  )

  const bodyHeightPx = timetableBodyHeightPx(OFFERED_GRID)

  const handleAddSection = useCallback(
    (sec: AdminCourseSection) => {
      if (isSectionInBin(binItems, sec)) {
        return
      }
      const cat = catalogByCode.get(cellText(sec.course_code).toUpperCase())
      addToCourseBin(adminSectionToCourseBinItem(sec, cat))
      showToast('Added to CourseBin')
    },
    [addToCourseBin, binItems, catalogByCode, showToast],
  )

  const termMissing = registrationTermId == null || registrationTermId.trim() === ''

  return (
    <main
      className="portal-page portal-offered-timetable"
      data-registration-term={registrationTermId ?? undefined}
    >
      {toast != null && (
        <div className="portal-offered-timetable__toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

      <section className="portal-card portal-stack" aria-labelledby="offered-timetable-heading">
        <h2 id="offered-timetable-heading" className="portal-section-heading">
          Offered Timetable
        </h2>
        <p className="portal-text-muted" style={{ marginTop: 0 }}>
          Registrar-scheduled sections for the selected term (Monday–Friday, 8:00 a.m.–6:00 p.m.).
          Click a block to add that section to your CourseBin. Sections outside this window or without
          valid meeting times are hidden.
        </p>

        {termMissing && (
          <p className="portal-text-muted" role="status">
            Select an academic term above to view offerings.
          </p>
        )}

        {error != null && (
          <p className="portal-text-muted" role="alert">
            {error}
          </p>
        )}

        {!termMissing && loading && (
          <p className="portal-text-muted" role="status">
            Loading timetable…
          </p>
        )}

        {!termMissing && !loading && sections != null && sections.length === 0 && error == null && (
          <p className="portal-text-muted" role="status">
            No sections are scheduled for this term yet.
          </p>
        )}

        {!termMissing && !loading && sections != null && sections.length > 0 && (
          <div className="admin-timetable-wrap">
            <div
              className="admin-timetable-v2"
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
                        const inBin = isSectionInBin(binItems, b.section)
                        return (
                          <button
                            key={`${b.section.id}-${d.full}-${b.startMin}-${b.colIndex}`}
                            type="button"
                            className={[
                              'admin-timetable-v2__block',
                              'portal-offered-timetable__block',
                              inBin ? 'portal-offered-timetable__block--in-bin' : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            style={{
                              top: b.topPx,
                              height: b.heightPx,
                              left: `calc(${colW * b.colIndex}% + ${insetPx}px)`,
                              width: `calc(${colW}% - ${insetPx * 2}px)`,
                            }}
                            onClick={() => handleAddSection(b.section)}
                            aria-label={
                              inBin
                                ? `${b.section.course_code} section ${b.section.section_code}, already in CourseBin`
                                : `Add ${b.section.course_code} section ${b.section.section_code} to CourseBin`
                            }
                          >
                            <span className="admin-timetable-v2__block-title">
                              {b.section.course_code} {b.section.section_code}
                              {inBin ? (
                                <span className="portal-offered-timetable__badge"> Added</span>
                              ) : null}
                            </span>
                            <span className="admin-timetable-v2__block-meta">
                              {formatTimeHmsForDisplay(b.section.start_time)} –{' '}
                              {formatTimeHmsForDisplay(b.section.end_time)}
                            </span>
                            <span className="admin-timetable-v2__block-meta">
                              {formatDeliveryModeForDisplay(b.section.delivery_mode)}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
