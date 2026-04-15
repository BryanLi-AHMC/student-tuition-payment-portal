import type { StudentProgram } from "../types/studentProgram.js";
export type GraduationRequirements = {
    ruleSetId: string;
    sourceLabel: string;
    totalCreditsRequired: number;
    requiredCourses: string[];
    minimumGpa: number | null;
    maximumWithdrawals: number | null;
    notes: string[];
};
export declare const PROGRAM_GRADUATION_REQUIREMENTS: Record<StudentProgram, GraduationRequirements>;
export declare function getGraduationRequirementsForProgram(program: StudentProgram | null | undefined): GraduationRequirements;
//# sourceMappingURL=graduationRequirements.d.ts.map