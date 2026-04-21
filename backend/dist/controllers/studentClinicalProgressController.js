import { env } from "../config/env.js";
import { loadStudentClinicalProgressFromClinic } from "../repositories/studentClinicalProgressRepository.js";
import { pool } from "../lib/db.js";
function parseQueryString(req, key) {
    const raw = req.query[key];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v !== "string")
        return null;
    const t = v.trim();
    return t === "" ? null : t;
}
function devMessage(e) {
    return e instanceof Error ? e.message : typeof e === "string" ? e : String(e);
}
/**
 * GET /api/student/clinical-progress?studentId=
 *
 * Clinical hours and completed-clinical detail rows from legacy `clinic` (non-empty grade).
 * Fixed five-row exam history from legacy `marks` (CL% codes), matching the transcript source.
 */
export async function getStudentClinicalProgressHandler(req, res) {
    try {
        const studentId = parseQueryString(req, "studentId");
        if (!studentId) {
            res.status(400).json({
                error: "Query parameter studentId is required.",
            });
            return;
        }
        const payload = await loadStudentClinicalProgressFromClinic(pool, studentId);
        res.json(payload);
    }
    catch (e) {
        console.error("[student/clinical-progress] failed:", e);
        const body = {
            error: "Failed to load clinical progress.",
        };
        if (env.nodeEnv === "development")
            body.message = devMessage(e);
        res.status(500).json(body);
    }
}
//# sourceMappingURL=studentClinicalProgressController.js.map