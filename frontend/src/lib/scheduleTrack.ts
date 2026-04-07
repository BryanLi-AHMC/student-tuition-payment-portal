import type { AdminCourseSection } from './api'

export type ScheduleTrack = AdminCourseSection['schedule_track']

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
