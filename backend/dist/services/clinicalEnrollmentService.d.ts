import { type ClinicalEnrollmentSlotRow, type ClinicalEnrollmentStudentRow } from "../repositories/clinicalEnrollmentRepository.js";
export type OpenClinicalSlotForStudentDto = ClinicalEnrollmentSlotRow & {
    alreadyEnrolled: boolean;
};
export declare function listOpenClinicalSlotsForStudent(studentId: string, query?: {
    term?: string | null;
    year?: string | number | null;
}): Promise<OpenClinicalSlotForStudentDto[]>;
export declare function listStudentClinicalEnrollmentRows(studentId: string, query?: {
    term?: string | null;
    year?: string | number | null;
}): Promise<ClinicalEnrollmentStudentRow[]>;
export declare function enrollStudentInClinicalSlot(studentId: string, timetableId: number): Promise<{
    ok: true;
    enrollmentId: number;
    assignmentId: number;
} | {
    ok: false;
    error: string;
    status: number;
}>;
export declare function dropStudentClinicalEnrollment(studentId: string, enrollmentId: number): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
    status: number;
}>;
//# sourceMappingURL=clinicalEnrollmentService.d.ts.map