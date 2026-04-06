/**
 * Display helpers for schedule times stored as `HH:MM:SS` (or `HH:MM`) from the API.
 * Admin forms use 12-hour dropdowns; bridge via `timeToInputValue` / `twelveHourPartsToHhMm` / `inputTimeToApi`.
 */

export type Time12hParts = {
  hour12: number
  minute: number
  isPm: boolean
}

/** Parse API `HH:MM(:SS)` → 12h parts; invalid / empty → null */
export function parseHmsTo12hParts(
  t: string | null | undefined,
): Time12hParts | null {
  if (t == null || String(t).trim() === '') return null
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?/.exec(String(t).trim())
  if (!m) return null
  let h = Number(m[1])
  const minute = Number(m[2])
  if (!Number.isFinite(h) || !Number.isFinite(minute) || h > 23 || minute > 59) {
    return null
  }
  const isPm = h >= 12
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return { hour12, minute, isPm }
}

/**
 * 12h dropdowns → `HH:MM` (24h), suitable for merging with `inputTimeToApi`.
 * `hour12` 1–12, `minute` 0–59.
 */
export function twelveHourPartsToHhMm(parts: Time12hParts): string {
  const { hour12, minute, isPm } = parts
  let h24: number
  if (isPm) {
    h24 = hour12 === 12 ? 12 : hour12 + 12
  } else {
    h24 = hour12 === 12 ? 0 : hour12
  }
  return `${String(h24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

/** `TIME` from API → `HH:MM` for `<input type="time" />` */
export function timeToInputValue(t: string | null | undefined): string {
  if (t == null || String(t).trim() === '') return ''
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?/.exec(String(t).trim())
  if (!m) return ''
  const hh = m[1]!.padStart(2, '0')
  return `${hh}:${m[2]}`
}

/** `<input type="time" />` value → `HH:MM:SS` for API; empty → null */
export function inputTimeToApi(s: string): string | null {
  const v = s.trim()
  if (v === '') return null
  if (/^\d{1,2}:\d{2}$/.test(v)) return `${v}:00`
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(v)) return v
  return v
}

/**
 * Single time value → e.g. `09:00 AM`, `12:00 PM`, `03:30 PM`.
 * Unknown shape returns trimmed original; empty → em dash.
 */
export function formatTimeHmsForDisplay(value: string | null | undefined): string {
  if (value == null || String(value).trim() === '') return '—'
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?/.exec(String(value).trim())
  if (!m) return String(value).trim()
  let h = Number(m[1])
  const minutes = m[2]!
  if (!Number.isFinite(h) || h < 0 || h > 23) return String(value).trim()
  const isPm = h >= 12
  const h12 = h % 12 === 0 ? 12 : h % 12
  const ap = isPm ? 'PM' : 'AM'
  return `${String(h12).padStart(2, '0')}:${minutes} ${ap}`
}

/** Range for tables: `09:00 AM – 10:30 AM`; missing parts use em dash. */
export function formatTimeRangeHmsForDisplay(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  const a = formatTimeHmsForDisplay(start)
  const b = formatTimeHmsForDisplay(end)
  if (a === '—' && b === '—') return '—'
  if (a === '—') return b
  if (b === '—') return a
  return `${a} – ${b}`
}

/**
 * Parse a single time produced by `formatTimeHmsForDisplay` (e.g. `09:00 AM`) → `HH:MM:SS`.
 */
function parseAmPmDisplayToHhMmSs(part: string): string | null {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(part.trim())
  if (!m) return null
  let h = Number(m[1])
  const minutes = m[2]!
  const ap = m[3]!.toUpperCase()
  if (!Number.isFinite(h) || h < 1 || h > 12 || minutes.length !== 2) return null
  const minNum = Number(minutes)
  if (!Number.isFinite(minNum) || minNum > 59) return null
  let h24: number
  if (ap === 'PM') {
    h24 = h === 12 ? 12 : h + 12
  } else {
    h24 = h === 12 ? 0 : h
  }
  return `${String(h24).padStart(2, '0')}:${minutes}:00`
}

/**
 * Inverse of `formatTimeRangeHmsForDisplay` for strings like `09:00 AM – 10:30 AM`
 * (en dash or hyphen between parts).
 */
export function parseDisplayTimeRangeToHhMmSs(
  display: string,
): { start: string; end: string } | null {
  const t = display.trim()
  if (t === '' || t === '—' || /^TBA$/i.test(t)) return null
  const parts = t.split(/\s*[–-]\s+/).map((x) => x.trim()).filter(Boolean)
  if (parts.length !== 2) return null
  const a = parseAmPmDisplayToHhMmSs(parts[0]!)
  const b = parseAmPmDisplayToHhMmSs(parts[1]!)
  if (!a || !b) return null
  return { start: a, end: b }
}
