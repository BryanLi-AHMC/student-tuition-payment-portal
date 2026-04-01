import { DEMO_STUDENT_ID } from "../config/constants.js";
import { pool } from "../lib/db.js";
import { findLatestTermYearForStudent, loadAccountContext, } from "../repositories/studentAccountRepository.js";
import { getCatalogDemoAccountPayload } from "./demoAccountService.js";
import { assembleStudentAccountPayload } from "./studentAccountAssembler.js";
export async function getStudentAccountPayload(studentId, termYear) {
    let term;
    let year;
    if (termYear.mode === "explicit") {
        term = termYear.term;
        year = termYear.year;
    }
    else {
        const latest = await findLatestTermYearForStudent(pool, studentId);
        if (!latest) {
            if (studentId === DEMO_STUDENT_ID) {
                return getCatalogDemoAccountPayload("Fall", 2026);
            }
            console.debug("[account-debug] getStudentAccountPayload: no enrollments for auto term", JSON.stringify({ studentId }));
            return null;
        }
        term = latest.term;
        year = latest.year;
    }
    console.debug("[account-debug] getStudentAccountPayload input", JSON.stringify({ studentId, term, year, mode: termYear.mode }));
    try {
        const ctx = await loadAccountContext(pool, studentId, term, year);
        if (ctx) {
            return assembleStudentAccountPayload(ctx);
        }
    }
    catch (err) {
        if (studentId !== DEMO_STUDENT_ID) {
            throw err;
        }
        console.warn("[billing] MySQL error for demo-student — using catalog fallback:", err.message);
    }
    if (studentId === DEMO_STUDENT_ID) {
        return getCatalogDemoAccountPayload(term, year);
    }
    return null;
}
//# sourceMappingURL=studentAccountService.js.map