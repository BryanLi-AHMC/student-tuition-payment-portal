/**
 * Student-facing clinical completion rows from legacy `clinic` (non-empty grade + hours),
 * plus fixed clinical exam history from legacy `marks` (transcript source — not `clinic`).
 */
import type { Pool } from "mysql2/promise";
export type StudentClinicalProgressRecord = {
    code: string;
    courseTitle: string;
    term: string;
    year: number;
    grade: string;
    hours: number;
};
export type StudentClinicalExamHistoryItem = {
    code: string;
    examName: string;
    status: "Not Taken" | "Pending Grade" | "Completed";
    grade: string | null;
    term: string | null;
    year: number | null;
};
/**
 * Lists completed clinical rows (any non-empty grade) and hours from `clinic`;
 * exam history from `marks` only.
 */
export declare function loadStudentClinicalProgressFromClinic(pool: Pool, studentId: string): Promise<{
    completedCount: number;
    totalHours: number;
    records: StudentClinicalProgressRecord[];
    exams: StudentClinicalExamHistoryItem[];
}>;
//# sourceMappingURL=studentClinicalProgressRepository.d.ts.map