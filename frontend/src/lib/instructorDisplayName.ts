export type InstructorSuggestionFields = {
  nameEng?: string | null
  nameChi?: string | null
  rawText?: string | null
}

export function getPreferredInstructorDisplay(
  suggestion: InstructorSuggestionFields | null | undefined,
  track: 'EN' | 'CN',
): string {
  if (!suggestion) return ''

  const eng = (suggestion.nameEng ?? '').trim()
  const chi = (suggestion.nameChi ?? '').trim()
  const raw = (suggestion.rawText ?? '').trim()

  if (track === 'CN') {
    if (chi) return chi
    if (eng) return eng
    return raw
  }

  if (eng) return eng
  if (chi) return chi
  return raw
}
