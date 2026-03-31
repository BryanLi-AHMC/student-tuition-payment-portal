export function AddDropPage() {
  return (
    <main className="portal-page">
      <p className="portal-page-lede">
        Add or drop courses according to your program rules and the academic calendar. Changes may require
        advisor approval depending on your status and the dates in effect.
      </p>
      <section className="portal-card portal-stack" aria-labelledby="add-drop-workspace-heading">
        <h2 id="add-drop-workspace-heading" className="portal-section-heading">
          Your courses
        </h2>
        <p className="portal-inline-note portal-inline-note--flush">
          When registration opens, your enrolled sections and available actions will appear here.
        </p>
        <div className="portal-registration-placeholder" role="status">
          Add/drop table and actions will be available in a future release.
        </div>
      </section>
    </main>
  )
}
