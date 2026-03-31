import { Outlet } from 'react-router-dom'
import { DocumentsNav } from './DocumentsNav'

export function DocumentsLayout() {
  return (
    <div className="portal-documents-module">
      <header className="portal-module-header">
        <h1 className="portal-module-title">Documents & Forms</h1>
        <p className="portal-module-subtitle">
          Access policies, agreements, forms, handbook resources, and submitted documents.
        </p>
      </header>
      <DocumentsNav />
      <div className="portal-documents-outlet">
        <Outlet />
      </div>
    </div>
  )
}
