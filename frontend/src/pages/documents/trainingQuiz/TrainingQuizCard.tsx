import { useMemo } from 'react'
import type { DocumentQuizDefinition } from '../../../data/documentQuizzes'
import { QuizCertification } from './QuizCertification'
import { QuizQuestion } from './QuizQuestion'

const CERT_CHECKBOX_LABEL =
  'I certify that I have completed this training and understand the policy requirements.'

const VALIDATION_HINT =
  'Please answer all questions and confirm certification before submitting.'

type TrainingQuizCardProps = {
  quiz: DocumentQuizDefinition
  hidden?: boolean
  answers: Record<string, string>
  certified: boolean
  completed: boolean
  submitSuccessVisible: boolean
  onAnswerChange: (questionId: string, option: string) => void
  onCertifiedChange: (next: boolean) => void
  onSubmit: () => void
}

export function TrainingQuizCard({
  quiz,
  hidden,
  answers,
  certified,
  completed,
  submitSuccessVisible,
  onAnswerChange,
  onCertifiedChange,
  onSubmit,
}: TrainingQuizCardProps) {
  const allAnswered = useMemo(
    () => quiz.questions.every((q) => Boolean(answers[q.id]?.trim())),
    [quiz.questions, answers],
  )

  const canSubmit = allAnswered && certified && !completed
  const checkboxId = `doc-quiz-cert-${quiz.id}`

  return (
    <section
      className="portal-doc-quiz-card portal-card"
      role="tabpanel"
      id={`doc-quiz-panel-${quiz.id}`}
      aria-labelledby={`doc-quiz-tab-${quiz.id}`}
      hidden={hidden}
    >
      <h3 id={`doc-quiz-card-title-${quiz.id}`} className="portal-doc-quiz-card__title">
        {quiz.title}
      </h3>
      <p className="portal-doc-quiz-card__desc">{quiz.description}</p>

      <form
        className="portal-doc-quiz-card__form"
        onSubmit={(e) => {
          e.preventDefault()
          if (canSubmit) onSubmit()
        }}
        noValidate
      >
        <div className="portal-doc-quiz-questions">
          {quiz.questions.map((q, index) => (
            <QuizQuestion
              key={q.id}
              quizId={quiz.id}
              question={q}
              index={index}
              value={answers[q.id]}
              onChange={onAnswerChange}
              disabled={completed}
            />
          ))}
        </div>

        <QuizCertification
          certificationText={quiz.certificationText}
          checkboxLabel={CERT_CHECKBOX_LABEL}
          checked={certified}
          onChange={onCertifiedChange}
          disabled={completed}
          checkboxId={checkboxId}
        />

        {!completed && (!allAnswered || !certified) ? (
          <p className="portal-doc-quiz-hint" role="status">
            {VALIDATION_HINT}
          </p>
        ) : null}

        {submitSuccessVisible ? (
          <p className="portal-doc-quiz-success" role="status">
            Quiz submitted successfully.
          </p>
        ) : null}

        <div className="portal-doc-quiz-actions">
          <button
            type="submit"
            className="portal-btn portal-btn--primary"
            disabled={completed || !canSubmit}
          >
            {completed ? 'Submitted' : 'Submit'}
          </button>
        </div>
      </form>
    </section>
  )
}
