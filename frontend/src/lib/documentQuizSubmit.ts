import type { DocumentQuizId } from '../data/documentQuizzes'

/** Payload shape reserved for a future POST body */
export type DocumentQuizSubmitPayload = {
  quizId: DocumentQuizId
  answers: Record<string, string>
  certified: boolean
  submittedAt: string
}

/**
 * Stub for future API integration. Replace implementation with fetch/axios.
 */
export async function submitDocumentQuiz(
  _payload: DocumentQuizSubmitPayload,
): Promise<void> {
  await new Promise((r) => setTimeout(r, 0))
}
