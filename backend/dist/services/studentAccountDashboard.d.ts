import type { MarksRow } from "../repositories/studentAcademicsRepository.js";
import type { AccountCurrentTerm, AccountRegistration, ScheduleRow } from "../types/studentAccount.js";
export declare function quarterOrderForTerm(term: string): number;
export declare function buildAccountCurrentTerm(term: string, year: number): AccountCurrentTerm;
export declare function deriveAccountRegistration(args: {
    scheduleRows: ScheduleRow[];
    enrollmentSourceCount: number;
    termLabel: string;
}): AccountRegistration;
/**
 * Legacy account schedule lines from `marks` for the billing term.
 * Uses the same normalized academic course record mapping as `/academics`.
 */
export declare function scheduleRowsFromLegacyMarks(marks: MarksRow[], studentId: string): ScheduleRow[];
//# sourceMappingURL=studentAccountDashboard.d.ts.map