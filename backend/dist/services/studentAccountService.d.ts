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