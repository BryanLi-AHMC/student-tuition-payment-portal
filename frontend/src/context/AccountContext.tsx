import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchStudentAccount } from '../lib/api'
import { mahmAccountMock } from '../mock/mahmAccountMock'
import type { MahmAccountMock } from '../mock/mahmAccountMock'

const PORTAL_STUDENT_ID_KEY = 'portal_student_id'

/** Batch 2A: `account` falls back to this when live data is missing so legacy routes stay crash-free. */
const ACCOUNT_FALLBACK = mahmAccountMock

function readStoredStudentId(): string | null {
  try {
    const raw = localStorage.getItem(PORTAL_STUDENT_ID_KEY)
    const trimmed = raw?.trim() ?? ''
    return trimmed.length > 0 ? trimmed : null
  } catch {
    return null
  }
}

type AccountContextValue = {
  /** Last successful API payload for the current student; null after logout or a failed fetch. */
  fetchedAccount: MahmAccountMock | null
  /**
   * Same as `fetchedAccount` when present; otherwise `mahmAccountMock` (Batch 2A shim for consumers
   * that still assume a non-null account). Prefer `fetchedAccount` when you need real vs placeholder data.
   */
  account: MahmAccountMock
  loading: boolean
  error: string | null
  reload: () => void
  currentStudentId: string | null
  login: (studentId: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AccountContext = createContext<AccountContextValue | null>(null)

export function AccountProvider({ children }: { children: ReactNode }) {
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(() =>
    readStoredStudentId(),
  )
  const [fetchedAccount, setFetchedAccount] = useState<MahmAccountMock | null>(null)
  const [loading, setLoading] = useState(
    () => Boolean(readStoredStudentId()?.trim()),
  )
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const login = useCallback((studentId: string) => {
    const trimmed = studentId.trim()
    setCurrentStudentId(trimmed)
    try {
      localStorage.setItem(PORTAL_STUDENT_ID_KEY, trimmed)
    } catch {
      /* ignore quota / private mode */
    }
  }, [])

  const logout = useCallback(() => {
    setCurrentStudentId(null)
    try {
      localStorage.removeItem(PORTAL_STUDENT_ID_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!currentStudentId?.trim()) {
      setFetchedAccount(null)
      setLoading(false)
      setError(null)
      return
    }

    const id = currentStudentId.trim()
    const ac = new AbortController()

    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const raw = await fetchStudentAccount(id, 'Fall', 2026, ac.signal)
        if (ac.signal.aborted) return
        setFetchedAccount(raw as MahmAccountMock)
        setError(null)
      } catch (e) {
        if (ac.signal.aborted) return
        setFetchedAccount(null)
        setError(
          e instanceof Error ? e.message : 'Something went wrong loading your account.',
        )
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false)
        }
      }
    })()

    return () => ac.abort()
  }, [currentStudentId, reloadKey])

  const value = useMemo<AccountContextValue>(
    () => ({
      fetchedAccount,
      account: fetchedAccount ?? ACCOUNT_FALLBACK,
      loading,
      error,
      reload,
      currentStudentId,
      login,
      logout,
      isAuthenticated:
        currentStudentId !== null && currentStudentId.trim().length > 0,
    }),
    [
      currentStudentId,
      error,
      fetchedAccount,
      loading,
      login,
      logout,
      reload,
    ],
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) {
    throw new Error('useAccount must be used within AccountProvider')
  }
  return ctx
}
