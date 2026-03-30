import { createContext, useContext, type ReactNode } from 'react'
import { mahmAccountMock } from '../mock/mahmAccountMock'
import type { MahmAccountMock } from '../mock/mahmAccountMock'

type AccountContextValue = {
  account: MahmAccountMock
  loading: false
  error: null
  reload: () => void
}

const AccountContext = createContext<AccountContextValue | null>(null)

const value: AccountContextValue = {
  account: mahmAccountMock,
  loading: false,
  error: null,
  reload: () => {},
}

export function AccountProvider({ children }: { children: ReactNode }) {
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) {
    throw new Error('useAccount must be used within AccountProvider')
  }
  return ctx
}
