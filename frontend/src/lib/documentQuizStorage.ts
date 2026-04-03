import type { DocumentQuizId } from '../data/documentQuizzes'

const STORAGE_KEYS: Record<DocumentQuizId, string> = {
  ferpa: 'amu-doc-quiz-ferpa-completed',
  titleix: 'amu-doc-quiz-titleix-completed',
  campus: 'amu-doc-quiz-campus-completed',
}

/** Pre–refactor key; still honored in read for migration */
const LEGACY_CAMPUS_KEY = 'amu-doc-quiz-campus-safety-completed'

const DONE = '1'

export function readQuizCompletedFromStorage(quizId: DocumentQuizId): boolean {
  try {
    if (quizId === 'campus') {
      if (localStorage.getItem(STORAGE_KEYS.campus) === DONE) return true
      if (localStorage.getItem(LEGACY_CAMPUS_KEY) === DONE) return true
      return false
    }
    return localStorage.getItem(STORAGE_KEYS[quizId]) === DONE
  } catch {
    return false
  }
}

export function writeQuizCompletedToStorage(quizId: DocumentQuizId): void {
  try {
    localStorage.setItem(STORAGE_KEYS[quizId], DONE)
    if (quizId === 'campus') {
      localStorage.removeItem(LEGACY_CAMPUS_KEY)
    }
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
    titleix: readQuizCompletedFromStorage('titleix'),
    campus: readQuizCompletedFromStorage('campus'),
  }
}
