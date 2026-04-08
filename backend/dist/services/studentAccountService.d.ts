/**
 * Account / billing layer: may **merge** legacy academic schedule views and clinical progress (`buildClinicalProgress`)
 * for the dashboard. Upstream services keep registration, attempts, transcript, and clinic progress separate.
 * Degree audit: `computeDegreeAudit` in `domain/studentDomainModels.ts` when wired — not inside transcript services.
 *
 * Portal schedule truth: `portal_enrollments` (by `student_external_id`, calendar `term`/`year`, `status`) maps through
 * `portal_courses` to timetable `course_sections` — see `listStudentEnrolledSectionsForTerm`. `academic_terms.id`
 * values (e.g. `2026-FAL`) are metadata for API routing only; calendar term names come from `academic_terms.term_name`.
 */
import type { StudentAccountPayload } from "../types/studentAccount.js";
export type AccountTermYearInput = {
    mode: "explicit";
    term: string;
    year: number;
} | {
    mode: "auto";
};
export declare function getStudentAccountPayload(studentId: string, termYear: AccountTermYearInput): Promise<StudentAccountPayload | null>;
//# sourceMappingURL=studentAccountService.d.ts.map