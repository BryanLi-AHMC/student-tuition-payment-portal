import { MAHM_COURSES } from "../data/mahmCatalog.js";
function uniqueCourseCodes(courseCodes) {
    const seen = new Set();
    const out = [];
    for (const raw of courseCodes) {
        const courseCode = raw.trim().toUpperCase();
        if (courseCode === "" || seen.has(courseCode))
            continue;
        seen.add(courseCode);
        out.push(courseCode);
    }
    return out;
}
function sumRequiredCredits() {
    let total = 0;
    for (const course of MAHM_COURSES) {
        if (course.type === "clinical")
            continue;
        if (typeof course.units === "number" && Number.isFinite(course.units)) {
            total += course.units;
        }
    }
    return total;
}
const DEFAULT_REQUIRED_COURSES = uniqueCourseCodes(MAHM_COURSES.filter((course) => course.type !== "clinical").map((course) => course.courseCode));
const DEFAULT_GRADUATION_REQUIREMENTS = {
    ruleSetId: "shared_catalog_v1",
    sourceLabel: "backend MAHM catalog configuration",
    totalCreditsRequired: sumRequiredCredits(),
    requiredCourses: DEFAULT_REQUIRED_COURSES,
    minimumGpa: null,
    maximumWithdrawals: null,
    notes: [
        "Graduation eligibility is computed from the backend's structured catalog-backed rule set.",
        "Clinical hour and exception workflows are not yet enforced in this evaluator.",
    ],
};
export const PROGRAM_GRADUATION_REQUIREMENTS = {
    MAHM: {
        ...DEFAULT_GRADUATION_REQUIREMENTS,
        ruleSetId: "mahm_catalog_v1",
    },
    DAHM: {
        ...DEFAULT_GRADUATION_REQUIREMENTS,
        ruleSetId: "dahm_shared_catalog_v1",
        notes: [
            ...DEFAULT_GRADUATION_REQUIREMENTS.notes,
            "DAHM currently uses the shared configured portal curriculum until a DAHM-specific structured rule set is added.",
        ],
    },
};
export function getGraduationRequirementsForProgram(program) {
    if (program === "DAHM") {
        return PROGRAM_GRADUATION_REQUIREMENTS.DAHM;
    }
    return PROGRAM_GRADUATION_REQUIREMENTS.MAHM;
}
//# sourceMappingURL=graduationRequirements.js.map