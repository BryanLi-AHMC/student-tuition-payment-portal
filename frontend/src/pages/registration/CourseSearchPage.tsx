export function CourseSearchPage() {
  return (
    <main className="portal-page">
      <p className="portal-page-lede">
        Search by subject, course number, or keyword to explore offerings for the term. Refine by campus,
        delivery mode, or time as filters become available.
      </p>
      <section className="portal-card portal-stack" aria-labelledby="course-search-heading">
        <h2 id="course-search-heading" className="portal-section-heading">
          Search courses
        </h2>
        <div className="portal-registration-search">
          <label htmlFor="registration-course-search" className="visually-hidden">
            Search courses
          </label>
          <input
            id="registration-course-search"
            type="search"
            className="portal-registration-search-input"
            placeholder="e.g. NURS 301, anatomy, online"
            readOnly
            aria-readonly="true"
            aria-describedby="course-search-hint"
          />
          <button type="button" className="portal-btn portal-btn--primary" disabled>
            Search
          </button>
        </div>
        <p id="course-search-hint" className="portal-inline-note portal-inline-note--flush">
          Search is not connected to a catalog yet; this preview shows how the tool will look.
        </p>
        <div
          className="portal-registration-placeholder portal-registration-results-placeholder"
          role="status"
        >
          Matching sections and seat counts will display here after you run a search.
        </div>
      </section>
    </main>
  )
}
