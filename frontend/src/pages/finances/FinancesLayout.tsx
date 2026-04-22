import { Outlet } from 'react-router-dom'

export function FinancesLayout() {
  return (
    <div className="portal-finances-module">
      <div className="portal-finances-outlet">
        <Outlet />
      </div>
    </div>
  )
}
