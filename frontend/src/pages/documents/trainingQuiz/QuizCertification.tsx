type QuizCertificationProps = {
  certificationText: string
  checkboxLabel: string
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  checkboxId: string
}

export function QuizCertification({
  certificationText,
  checkboxLabel,
  checked,
  onChange,
  disabled,
  checkboxId,
}: QuizCertificationProps) {
  return (
    <div className="portal-doc-quiz-cert">
      <p className="portal-doc-quiz-cert__text">{certificationText}</p>
      <div className="portal-doc-quiz-cert__check-row">
        <input
          type="checkbox"
          className="portal-doc-quiz-cert__checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="portal-doc-quiz-cert__label" htmlFor={checkboxId}>
          {checkboxLabel}
        </label>
      </div>
    </div>
  )
}
