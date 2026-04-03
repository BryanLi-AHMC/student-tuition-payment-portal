type CertificationCheckboxProps = {
  certificationText: string
  checkboxLabel: string
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  checkboxId: string
}

export function CertificationCheckbox({
  certificationText,
  checkboxLabel,
  checked,
  onChange,
  disabled,
  checkboxId,
}: CertificationCheckboxProps) {
  return (
    <div className="portal-doc-quiz-cert portal-doc-quiz-form-cert">
      <p className="portal-doc-quiz-form-cert__text">{certificationText}</p>
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
