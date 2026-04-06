import { RagQuestionValidationError, answerAmuQuestion, } from "../services/ragService.js";
function readQuestion(req) {
    const body = req.body;
    if (body == null || typeof body !== "object")
        return undefined;
    return body.question;
}
/**
 * POST /api/ai/ask
 * Body: { question: string, history?: { role: 'user' | 'assistant', content: string }[] }
 */
export async function postAiAsk(req, res) {
    const body = req.body;
    const q = readQuestion(req);
    if (typeof q !== "string") {
        res.status(400).json({
            error: "question is required and must be a string",
        });
        return;
    }
    if (body != null &&
        typeof body === "object" &&
        Object.prototype.hasOwnProperty.call(body, "history") &&
        body.history != null &&
        !Array.isArray(body.history)) {
        res.status(400).json({ error: "history must be an array when provided" });
        return;
    }
    const rawHistory = body != null &&
        typeof body === "object" &&
        Object.prototype.hasOwnProperty.call(body, "history")
        ? body.history
        : undefined;
    try {
        const result = await answerAmuQuestion(q, rawHistory);
        res.status(200).json(result);
    }
    catch (e) {
        if (e instanceof RagQuestionValidationError) {
            res.status(400).json({ error: e.message });
            return;
        }
        console.error("[ai/ask]", e);
        res.status(500).json({ error: "Internal processing failed" });
    }
}
//# sourceMappingURL=aiAskController.js.map