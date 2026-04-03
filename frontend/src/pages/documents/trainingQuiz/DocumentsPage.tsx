import { useCallback, useState } from 'react'
import {
  DOCUMENT_QUIZZES,
  type QuizId,
} from '../../../data/documentQuizzes'
import { submitDocumentQuiz } from '../../../lib/documentQuizSubmit'
import {
  readAllQuizCompletedFromStorage,
  writeQuizCompletedToStorage,
} from '../../../lib/documentQuizStorage'
import { QuizEntrySection } from './QuizEntrySection'

const emptyAnswers = (): Record<QuizId, Record<string, string>> => ({
  ferpa: {},
  titleix: {},
  campus: {},
})

const initialCertified = (): Record<QuizId, boolean> => ({
  ferpa: false,
  titleix: false,
  campus: false,
})

/**
 * Documents home: Quiz entry and policy training (FERPA, Title IX, Campus Safety).
 * Layout header and back link live in DocumentsLayout.
 */
export function DocumentsPage() {
  const [activeSection, setActiveSection] = useState<'quiz' | null>(null)
  const [expandedQuizId, setExpandedQuizId] = useState<QuizId | null>(null)
  const [answersByQuiz, setAnswersByQuiz] =
    useState<Record<QuizId, Record<string, string>>>(emptyAnswers)
  const [certifiedByQuiz, setCertifiedByQuiz] =
    useState<Record<QuizId, boolean>>(initialCertified)
  const [completedByQuiz, setCompletedByQuiz] = useState<
    Record<QuizId, boolean>
  >(() => readAllQuizCompletedFromStorage())

  const handleToggleExpand = useCallback(
    (id: QuizId) => {
      setExpandedQuizId((prev) => (prev === id ? null : id))
    },
    [],
  )

  const handleSubmit = useCallback(
    async (quizId: QuizId) => {
      const answers = answersByQuiz[quizId] ?? {}
      const certified = certifiedByQuiz[quizId] ?? false
      await submitDocumentQuiz({
        quizId,
        answers,
        certified,
        submittedAt: new Date().toISOString(),
      })
      writeQuizCompletedToStorage(quizId)
      setCompletedByQuiz((prev) => ({ ...prev, [quizId]: true }))
    },
    [answersByQuiz, certifiedByQuiz],
  )

  const quizSectionOpen = activeSection === 'quiz'

  return (
    <div className="portal-documents-quiz-page">
      <h2 className="portal-documents-quiz-page-title">DOCUMENTS</h2>

      <div
        className="portal-academics-print-hide portal-documents-quiz-entry-toggle"
        role="group"
        aria-label="Documents options"
      >
        <div className="portal-tab-group portal-academics-portal-tabs">
          <button
            type="button"
            className={[
              'portal-tab',
              quizSectionOpen ? 'portal-tab--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={quizSectionOpen}
            onClick={() => {
              setActiveSection((s) => {
                if (s === 'quiz') {
                  setExpandedQuizId(null)
                  return null
                }
                return 'quiz'
              })
            }}
          >
            Quiz
          </button>
        </div>
      </div>

      {quizSectionOpen ? (
        <QuizEntrySection
          quizzes={DOCUMENT_QUIZZES}
          expandedQuizId={expandedQuizId}
          completedByQuiz={completedByQuiz}
          answersByQuiz={answersByQuiz}
          certifiedByQuiz={certifiedByQuiz}
          onToggleExpand={handleToggleExpand}
          onAnswerChange={(quizId, questionId, option) => {
            setAnswersByQuiz((prev) => ({
              ...prev,
              [quizId]: {
                ...(prev[quizId] ?? {}),
                [questionId]: option,
              },
            }))
          }}
          onCertifiedChange={(quizId, next) => {
            setCertifiedByQuiz((prev) => ({ ...prev, [quizId]: next }))
          }}
          onSubmit={(quizId) => {
            void handleSubmit(quizId)
          }}
        />
      ) : null}
    </div>
  )
}
