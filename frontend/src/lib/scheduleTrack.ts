import type { AdminCourseSection } from './api'

export type ScheduleTrack = AdminCourseSection['schedule_track']

/** Strip zero-width / BOM-like chars so `"CN\u200B"` still classifies as CN. */
const SCHEDULE_TRACK_ZW_RE = /[\u200B-\u200D\uFEFF]/g

/**
 * Normalize API/DB `schedule_track` for offered-timetable grouping.
 * Only `CN` (after cleanup) maps to the Chinese timetable; everything else is English.
 */
export function normalizeScheduleTrackValue(raw: unknown): ScheduleTrack {
  const s =
    raw == null || raw === ''
      ? ''
      : String(raw).replace(SCHEDULE_TRACK_ZW_RE, '').trim().toUpperCase()
  return s === 'CN' ? 'CN' : 'EN'
}

export function offeredTimetableHeading(track: ScheduleTrack): string {
  return track === 'CN' ? 'Offered Chinese Timetable' : 'Offered English Timetable'
}

export function adminTimetableHeading(track: ScheduleTrack): string {
  return track === 'CN' ? 'Chinese Timetable' : 'English Timetable'
}

/** Table column / short label */
export function scheduleTrackTableLabel(track: ScheduleTrack): string {
  return track === 'CN' ? 'Chinese' : 'English'
}

/** Modal / detail line (full phrase per product copy). */
export function scheduleTrackDetailLabel(track: ScheduleTrack): string {
  return track === 'CN' ? 'Chinese timetable' : 'English timetable'
}
