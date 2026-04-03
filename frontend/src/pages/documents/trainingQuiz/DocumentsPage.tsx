import { useCallback, useState } from 'react'
import {
  DOCUMENT_QUIZZES,
  type DocumentQuizId,
} from '../../../data/documentQuizzes'
import { submitDocumentQuiz } from '../../../lib/documentQuizSubmit'
import {
  readAllQuizCompletedFromStorage,
  writeQuizCompletedToStorage,
} from '../../../lib/documentQuizStorage'
import { TrainingQuizCard } from './TrainingQuizCard'
import { TrainingQuizTabs } from './TrainingQuizTabs'

const emptyAnswers = (): Record<DocumentQuizId, Record<string, string>> => ({
  ferpa: {},
  'title-ix': {},
  'campus-safety': {},
})

const initialCertified = (): Record<DocumentQuizId, boolean> => ({
  ferpa: false,
  'title-ix': false,
  'campus-safety': false,
})

/**
 * Documents home: policy training quizzes (FERPA, Title IX, Campus Safety).
 * Layout header and back link live in DocumentsLayout.
 */
export function DocumentsPage() {
  const [activeId, setActiveId] = useState<DocumentQuizId>('ferpa')
  const [answersByQuiz, setAnswersByQuiz] =
    useState<Record<DocumentQuizId, Record<string, string>>>(emptyAnswers)
  const [certifiedByQuiz, setCertifiedByQuiz] =
    useState<Record<DocumentQuizId, boolean>>(initialCertified)
  const [completedByQuiz, setCompletedByQuiz] = useState<
    Record<DocumentQuizId, boolean>
  >(() => readAllQuizCompletedFromStorage())

  const handleSubmit = useCallback(
    async (quizId: DocumentQuizId) => {
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

  return (
    <div className="portal-documents-training-stack">
      <h2 className="portal-documents-training-page-title">DOCUMENTS</h2>
      <TrainingQuizTabs
        quizzes={DOCUMENT_QUIZZES}
        activeId={activeId}
        onSelect={setActiveId}
        completedById={completedByQuiz}
      />
      <div className="portal-doc-quiz-panels">
        {DOCUMENT_QUIZZES.map((quiz) => (
          <TrainingQuizCard
            key={quiz.id}
            quiz={quiz}
            hidden={quiz.id !== activeId}
            answers={answersByQuiz[quiz.id] ?? {}}
            certified={certifiedByQuiz[quiz.id] ?? false}
            completed={completedByQuiz[quiz.id] ?? false}
            submitSuccessVisible={completedByQuiz[quiz.id] ?? false}
            onAnswerChange={(questionId, option) => {
              setAnswersByQuiz((prev) => ({
                ...prev,
                [quiz.id]: {
                  ...(prev[quiz.id] ?? {}),
                  [questionId]: option,
                },
              }))
            }}
            onCertifiedChange={(next) => {
              setCertifiedByQuiz((prev) => ({ ...prev, [quiz.id]: next }))
            }}
            onSubmit={() => {
              void handleSubmit(quiz.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
