import type { DocumentQuizId } from '../data/documentQuizzes'

const STORAGE_KEYS: Record<DocumentQuizId, string> = {
  ferpa: 'amu-doc-quiz-ferpa-completed',
  'title-ix': 'amu-doc-quiz-titleix-completed',
  'campus-safety': 'amu-doc-quiz-campus-safety-completed',
}

const DONE = '1'

export function readQuizCompletedFromStorage(
  quizId: DocumentQuizId,
): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS[quizId]) === DONE
  } catch {
    return false
  }
}

export function writeQuizCompletedToStorage(quizId: DocumentQuizId): void {
  try {
    localStorage.setItem(STORAGE_KEYS[quizId], DONE)
  } catch {
    /* ignore quota / private mode */
  }
}

export function readAllQuizCompletedFromStorage(): Record<
  DocumentQuizId,
  boolean
> {
  return {
    ferpa: readQuizCompletedFromStorage('ferpa'),
    'title-ix': readQuizCompletedFromStorage('title-ix'),
    'campus-safety': readQuizCompletedFromStorage('campus-safety'),
  }
}
