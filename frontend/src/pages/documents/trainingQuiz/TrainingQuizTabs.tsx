import type { DocumentQuizDefinition, DocumentQuizId } from '../../../data/documentQuizzes'

type TrainingQuizTabsProps = {
  quizzes: DocumentQuizDefinition[]
  activeId: DocumentQuizId
  onSelect: (id: DocumentQuizId) => void
  completedById: Record<DocumentQuizId, boolean>
}

export function TrainingQuizTabs({
  quizzes,
  activeId,
  onSelect,
  completedById,
}: TrainingQuizTabsProps) {
  return (
    <div
      className="portal-doc-quiz-tabs-wrap"
      role="tablist"
      aria-label="Training policy quizzes"
    >
      <div className="portal-tab-group portal-academics-portal-tabs portal-doc-quiz-tab-group">
        {quizzes.map((q) => {
          const isActive = q.id === activeId
          const done = completedById[q.id]
          return (
            <button
              key={q.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              id={`doc-quiz-tab-${q.id}`}
              aria-controls={`doc-quiz-panel-${q.id}`}
              className={[
                'portal-tab',
                'portal-doc-quiz-tab',
                isActive ? 'portal-tab--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(q.id)}
            >
              <span className="portal-doc-quiz-tab__label">{q.title}</span>
              {done ? (
                <span className="portal-doc-quiz-tab__done" aria-label="Completed">
                  <span className="portal-doc-quiz-tab__dot" aria-hidden="true" />
                  <span className="portal-doc-quiz-tab__done-text">Completed</span>
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
