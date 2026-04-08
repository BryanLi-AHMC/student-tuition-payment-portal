/**
 * Registration (portal) + academic attempts (`marks`) in one payload. `transcript` = marks-only slice for this API.
 * `enrollmentHistory` (JSON key) = **combinedAcademicHistory**: sorted union of registration rows + attempts — not
 * “registration-only” naming; see {@link CombinedAcademicHistoryItem}.
 *
 * Does not compute degree audit or clinical progress; merge those only at the account layer when needed.
 */
import type { StudentAcademicsResponse } from "../types/studentAcademics.js";
export declare function getStudentAcademicsPayload(studentId: string): Promise<StudentAcademicsResponse>;
//# sourceMappingURL=studentAcademicsService.d.ts.map