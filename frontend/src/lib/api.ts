export { formatMoney } from './formatMoney'

export const CARD_CONVENIENCE_RATE = 0.0285

/** Normalized base (no trailing slash). Empty → relative `/api/...` (same-origin or Vite proxy). */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/$/, '')

const JSON_SNIPPET_MAX = 280

/**
 * Join base + path. `path` must start with `/` (e.g. `/api/students/x/account` or `...?term=Fall&year=2026`).
 */
export function buildApiUrl(pathWithQuery: string): string {
  const path =
    pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`
  if (!API_BASE_URL) return path
  return `${API_BASE_URL}${path}`
}

/**
 * Low-level fetch with debug logs (final URL, status, content-type).
 */
export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = buildApiUrl(path)
  console.debug('[api] request', url)
  const res = await fetch(url, init)
  const ct = res.headers.get('content-type') ?? ''
  console.debug('[api] response', res.status, ct || '(no content-type)')
  return res
}

/**
 * Fetch JSON from the API. Verifies `application/json` before parsing; throws with status, content-type,
 * and a body snippet when the response is HTML or other non-JSON.
 */
export async function fetchApiJson(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const res = await apiFetch(path, init)
  const ct = (res.headers.get('content-type') ?? '').toLowerCase()
  const text = await res.text()

  if (!ct.includes('application/json')) {
    const snippet =
      text
        .slice(0, JSON_SNIPPET_MAX)
        .replace(/\s+/g, ' ')
        .trim() || '(empty)'
    const prefix = `Expected application/json but got "${ct || 'no content-type'}" (HTTP ${res.status}). Body starts with: ${snippet}`
    if (!res.ok) {
      throw new Error(`Request failed: ${prefix}`)
    }
    throw new Error(prefix)
  }

  const trimmed = text.trim()
  if (trimmed === '') {
    if (!res.ok) {
      throw new Error(`Request failed (HTTP ${res.status})`)
    }
    return null
  }

  let data: unknown
  try {
    data = JSON.parse(trimmed) as unknown
  } catch {
    throw new Error(`Invalid JSON in response (HTTP ${res.status})`)
  }

  if (!res.ok) {
    const body = data as { error?: string; message?: string }
    const msg =
      (typeof body.message === 'string' && body.message) ||
      (typeof body.error === 'string' && body.error) ||
      `Request failed (HTTP ${res.status})`
    throw new Error(msg)
  }

  return data
}

export type FetchStudentAccountOptions = {
  /** When both set, load that term only; otherwise the API uses the latest enrolled term/year. */
  term?: string
  year?: number
  signal?: AbortSignal
}

/**
 * GET /api/students/:studentId/account
 * Optional query: `term` + `year` together for a specific term; omit both to use the student's
 * latest term with enrollments (server-side resolution).
 */
export async function fetchStudentAccount(
  studentId: string,
  options?: FetchStudentAccountOptions,
): Promise<unknown> {
  const { term, year, signal } = options ?? {}
  const params = new URLSearchParams()
  if (
    typeof term === 'string' &&
    term.trim() !== '' &&
    year != null &&
    Number.isFinite(year)
  ) {
    params.set('term', term.trim())
    params.set('year', String(year))
  }
  const qs = params.toString()
  const path = `/api/students/${encodeURIComponent(studentId)}/account${qs ? `?${qs}` : ''}`
  console.debug('[account-debug] fetchStudentAccount', buildApiUrl(path))
  return fetchApiJson(path, { signal })
}

export type LoginStudentSuccess = {
  studentId: string
  displayName: string
}

/**
 * POST /api/auth/login — legacy students table password check.
 * On success returns { studentId, displayName }; throws on 4xx/5xx (see fetchApiJson).
 */
export async function loginStudent(
  studentId: string,
  password: string,
  options?: { signal?: AbortSignal },
): Promise<LoginStudentSuccess> {
  const data = (await fetchApiJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: studentId.trim(),
      password,
    }),
    signal: options?.signal,
  })) as unknown

  if (
    data != null &&
    typeof data === 'object' &&
    typeof (data as { studentId?: unknown }).studentId === 'string' &&
    typeof (data as { displayName?: unknown }).displayName === 'string'
  ) {
    const o = data as LoginStudentSuccess
    return { studentId: o.studentId, displayName: o.displayName }
  }

  throw new Error('Unexpected login response shape')
}
