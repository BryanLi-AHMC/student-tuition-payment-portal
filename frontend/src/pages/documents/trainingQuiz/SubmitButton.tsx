import type { ReactNode } from 'react'

type SubmitButtonProps = {
  disabled?: boolean
  children: ReactNode
}

export function SubmitButton({ disabled, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="portal-btn portal-btn--primary portal-doc-quiz-submit-btn"
      disabled={disabled}
    >
      {children}
    </button>
  )
}
