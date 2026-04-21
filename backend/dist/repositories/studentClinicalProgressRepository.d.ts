/**
 * Student-facing clinical completion rows from legacy `clinic` only (grade P, raw hours).
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
/**
 * Lists passed clinical rows and a summary from `clinic` (source of truth for this endpoint).
 */
export declare function loadStudentClinicalProgressFromClinic(pool: Pool, studentId: string): Promise<{
    completedCount: number;
    totalHours: number;
    records: StudentClinicalProgressRecord[];
}>;
//# sourceMappingURL=studentClinicalProgressRepository.d.ts.map