export type RetrievedChunk = {
    id: string;
    source: string;
    chunkIndex: number;
    content: string;
    score: number;
};
export type RagAnswerResult = {
    question: string;
    answer: string;
    sources: RetrievedChunk[];
};
export type ChatHistoryItem = {
    role: "user" | "assistant";
    content: string;
};
export type GroundedAmuPipeline = "policy" | "mixed";
export type AnswerAmuQuestionOptions = {
    studentContext?: string | null;
    pipeline?: GroundedAmuPipeline;
};
export declare class RagQuestionValidationError extends Error {
    constructor(message: string);
}
/**
 * Normalize optional client-supplied history: drop invalid entries, trim, cap length and count.
 */
export declare function sanitizeChatHistory(raw: unknown): ChatHistoryItem[] | undefined;
export declare function answerGeneralQuestion(question: string): Promise<RagAnswerResult>;
export declare function answerStudentRecordQuestionFromFacts(question: string, studentFacts: string): Promise<RagAnswerResult>;
/**
 * Grounded AMU answer path for policy-only and mixed student+policy questions.
 * @param rawHistory - Optional recent turns; sanitized (capped, invalid entries dropped).
 */
export declare function answerAmuQuestion(question: string, rawHistory?: unknown, options?: AnswerAmuQuestionOptions): Promise<RagAnswerResult>;
//# sourceMappingURL=ragService.d.ts.map