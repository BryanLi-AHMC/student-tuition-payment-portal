import {
  parseHmsTo12hParts,
  timeToInputValue,
  twelveHourPartsToHhMm,
} from '../../lib/formatScheduleTime'

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

type Props = {
  idPrefix: string
  label: string
  /** `HH:MM` 24h or '' (from `timeToInputValue` / cleared) */
  value: string
  onChange: (hhMm: string) => void
  disabled?: boolean
}

/**
 * Hour (1–12), minute (0–59), AM/PM. Emits `HH:MM` for `inputTimeToApi`.
 */
export function AdminTime12hFields({
  idPrefix,
  label,
  value,
  onChange,
  disabled,
}: Props) {
  const fromApi = value.trim() === '' ? null : parseHmsTo12hParts(value)
  const fromInput = value.trim() === '' ? null : parseHmsTo12hParts(timeToInputValue(value))
  const parts = fromApi ?? fromInput

  const hourVal = parts?.hour12 ?? ''
  const minVal = parts?.minute ?? ''
  const apVal = parts == null ? '' : parts.isPm ? 'PM' : 'AM'

  const emit = (h12: number, min: number, ap: 'AM' | 'PM') => {
    onChange(twelveHourPartsToHhMm({ hour12: h12, minute: min, isPm: ap === 'PM' }))
  }

  return (
    <div className="admin-field">
      <span className="admin-field__label" id={`${idPrefix}-label`}>
        {label}
      </span>
      <div
        className="admin-time12h"
        role="group"
        aria-labelledby={`${idPrefix}-label`}
      >
        <select
          id={`${idPrefix}-hour`}
          className="admin-input admin-time12h__select"
          aria-label={`${label} hour`}
          disabled={disabled}
          value={hourVal === '' ? '' : String(hourVal)}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') {
              onChange('')
              return
            }
            const h12 = Number(v)
            if (!Number.isFinite(h12)) return
            const min =
              minVal === '' ? 0 : (Number(minVal) || 0)
            const ap = apVal === '' ? 'AM' : (apVal as 'AM' | 'PM')
            emit(h12, min, ap)
          }}
        >
          <option value="">—</option>
          {HOURS_12.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <span className="admin-time12h__sep" aria-hidden>
          :
        </span>
        <select
          id={`${idPrefix}-min`}
          className="admin-input admin-time12h__select"
          aria-label={`${label} minute`}
          disabled={disabled}
          value={minVal === '' ? '' : String(minVal).padStart(2, '0')}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') {
              onChange('')
              return
            }
            const min = Number(v)
            if (!Number.isFinite(min)) return
            const h12 =
              hourVal === '' ? 12 : (Number(hourVal) || 12)
            const ap = apVal === '' ? 'AM' : (apVal as 'AM' | 'PM')
            emit(h12, min, ap)
          }}
        >
          <option value="">—</option>
          {MINUTES.map((m) => (
            <option key={m} value={String(m).padStart(2, '0')}>
              {String(m).padStart(2, '0')}
            </option>
          ))}
        </select>
        <select
          id={`${idPrefix}-ap`}
          className="admin-input admin-time12h__select admin-time12h__select--ap"
          aria-label={`${label} AM or PM`}
          disabled={disabled}
          value={apVal}
          onChange={(e) => {
            const v = e.target.value
            if (v !== 'AM' && v !== 'PM') {
              onChange('')
              return
            }
            const h12 =
              hourVal === '' ? 12 : (Number(hourVal) || 12)
            const min =
              minVal === '' ? 0 : (Number(minVal) || 0)
            emit(h12, min, v)
          }}
        >
          <option value="">—</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  )
}
