import { BackToDashboardLink } from './BackToDashboardLink'

type ModuleItem = {
  label: string
  future?: boolean
}

type ModulePlaceholderPageProps = {
  title: string
  subtitle: string
  items: ModuleItem[]
}

export function ModulePlaceholderPage({ title, subtitle, items }: ModulePlaceholderPageProps) {
  return (
    <main className="portal-page portal-module-page">
      <header className="portal-module-header">
        <BackToDashboardLink />
        <h1 className="portal-page-title">{title}</h1>
        <p className="portal-module-subtitle">{subtitle}</p>
      </header>
      <section className="portal-module-panel" aria-labelledby="portal-module-functions-heading">
        <h2 id="portal-module-functions-heading" className="portal-module-panel-heading">
          In this section
        </h2>
        <ul className="portal-module-list">
          {items.map((item) => (
            <li key={item.label} className="portal-module-list-item">
              <span className="portal-module-list-label">{item.label}</span>
              {item.future ? (
                <span className="portal-module-list-badge" title="Planned for a future release">
                  Future
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
