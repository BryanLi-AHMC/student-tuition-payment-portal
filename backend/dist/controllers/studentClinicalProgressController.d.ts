import type { Request, Response } from "express";
/**
 * GET /api/student/clinical-progress?studentId=
 *
 * Reads passed clinical completions from legacy `clinic` only (grade P, raw hours column).
 */
export declare function getStudentClinicalProgressHandler(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=studentClinicalProgressController.d.ts.map