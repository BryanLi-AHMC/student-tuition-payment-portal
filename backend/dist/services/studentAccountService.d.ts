/**
 * Account / billing layer: may **merge** legacy academic schedule views and clinical progress (`buildClinicalProgress`)
 * for the dashboard. Upstream services keep registration, attempts, transcript, and clinic progress separate.
 * Degree audit: `computeDegreeAudit` in `domain/studentDomainModels.ts` when wired — not inside transcript services.
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