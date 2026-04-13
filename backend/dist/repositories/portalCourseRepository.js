import { pool } from "../lib/db.js";
function trimNullableString(value) {
    if (value == null)
        return null;
    const trimmed = String(value).trim();
    return trimmed === "" ? null : trimmed;
}
function normalizeCourseCodeKey(courseCode) {
    return courseCode.trim().toUpperCase();
}
function isMysqlDupEntry(e) {
    return (typeof e === "object" &&
        e !== null &&
        "code" in e &&
        e.code === "ER_DUP_ENTRY");
}
function inferPortalTypeFromLegacy(engName) {
    const normalized = engName.toLowerCase();
    if (/\blab(oratory)?\b/i.test(engName) || /\blab\b/.test(normalized)) {
        return "lab";
    }
    if (normalized.includes("clinic") || normalized.includes("internship")) {
        return "clinical";
    }
    return "didactic";
}
function legacyPortalCourseId(sequenceNumber) {
    return `LEGACY${sequenceNumber}`;
}
function coerceLegacyUnits(value) {
    if (value == null)
        return null;
    if (typeof value === "number" && Number.isFinite(value))
        return value;
    const trimmed = String(value).trim();
    if (trimmed === "")
        return null;
    const asNumber = Number(trimmed);
    return Number.isFinite(asNumber) ? asNumber : trimmed;
}
function buildLegacyPortalCourseSeed(row) {
    const courseCode = trimNullableString(row.course_code ?? row.code);
    if (!courseCode)
        return null;
    const sequenceNumber = Number(row.sequenceNumber);
    if (!Number.isInteger(sequenceNumber) || sequenceNumber <= 0)
        return null;
    const titleRaw = trimNullableString(row.eng_name) ?? "";
    return {
        sequenceNumber,
        courseId: legacyPortalCourseId(sequenceNumber),
        courseCode,
        title: titleRaw !== "" ? titleRaw : courseCode,
        type: inferPortalTypeFromLegacy(titleRaw),
        units: coerceLegacyUnits(row.units),
    };
}
async function listDeterministicLegacyPortalCourseSeeds(db) {
    const [rows] = await db.query(`SELECT sequenceNumber, TRIM(code) AS course_code, eng_name, units
     FROM courses
     WHERE TRIM(COALESCE(code, '')) <> ''
     ORDER BY sequenceNumber ASC`);
    const byCode = new Map();
    for (const row of rows) {
        const seed = buildLegacyPortalCourseSeed(row);
        if (!seed)
            continue;
        const key = normalizeCourseCodeKey(seed.courseCode);
        if (!byCode.has(key)) {
            byCode.set(key, seed);
        }
    }
    return [...byCode.values()];
}
async function getExistingPortalCourseKeys(db) {
    const [rows] = await db.query(`SELECT TRIM(course_code) AS course_code
     FROM portal_courses
     WHERE TRIM(COALESCE(course_code, '')) <> ''`);
    const out = new Set();
    for (const row of rows) {
        const courseCode = trimNullableString(row.course_code);
        if (!courseCode)
            continue;
        out.add(normalizeCourseCodeKey(courseCode));
    }
    return out;
}
async function insertLegacyPortalCourseSeed(db, seed) {
    try {
        const [result] = await db.query(`INSERT INTO portal_courses (course_id, course_code, title, type, units, hours)
       VALUES (?, ?, ?, ?, ?, NULL)`, [seed.courseId, seed.courseCode, seed.title, seed.type, seed.units]);
        return result.affectedRows > 0;
    }
    catch (e) {
        if (!isMysqlDupEntry(e))
            throw e;
        return false;
    }
}
async function getDeterministicLegacyPortalCourseSeedByCode(db, courseCode) {
    const code = courseCode.trim();
    if (code === "")
        return null;
    const [rows] = await db.query(`SELECT sequenceNumber, TRIM(code) AS course_code, eng_name, units
     FROM courses
     WHERE CONVERT(TRIM(code) USING utf8mb4) COLLATE utf8mb4_unicode_ci = ?
     ORDER BY sequenceNumber ASC
     LIMIT 1`, [code]);
    return rows.length > 0 ? buildLegacyPortalCourseSeed(rows[0]) : null;
}
async function findPortalCourseIdsByCode(db, courseCode) {
    const [rows] = await db.query(`SELECT course_id
     FROM portal_courses
     WHERE CONVERT(TRIM(course_code) USING utf8mb4) COLLATE utf8mb4_unicode_ci = ?
     LIMIT 2`, [courseCode.trim()]);
    return rows.map((row) => String(row.course_id));
}
export async function ensurePortalCoursesForLegacyCatalog(db = pool) {
    const seeds = await listDeterministicLegacyPortalCourseSeeds(db);
    const existingBefore = await getExistingPortalCourseKeys(db);
    const missingSeeds = seeds.filter((seed) => !existingBefore.has(normalizeCourseCodeKey(seed.courseCode)));
    let inserted = 0;
    for (const seed of missingSeeds) {
        if (await insertLegacyPortalCourseSeed(db, seed)) {
            inserted += 1;
        }
    }
    const existingAfter = await getExistingPortalCourseKeys(db);
    let mappedAfter = 0;
    for (const seed of seeds) {
        if (existingAfter.has(normalizeCourseCodeKey(seed.courseCode))) {
            mappedAfter += 1;
        }
    }
    return {
        totalCatalogCourses: seeds.length,
        missingBefore: missingSeeds.length,
        inserted,
        mappedAfter,
    };
}
export async function resolvePortalCourseIdByCourseCode(db, courseCode) {
    const code = courseCode.trim();
    if (code === "") {
        return { ok: false, error: "Course code is required." };
    }
    const existing = await findPortalCourseIdsByCode(db, code);
    if (existing.length === 1) {
        return { ok: true, courseId: existing[0] };
    }
    if (existing.length > 1) {
        return {
            ok: false,
            error: `Course code ${code} matches multiple portal courses.`,
        };
    }
    const seed = await getDeterministicLegacyPortalCourseSeedByCode(db, code);
    if (!seed) {
        return {
            ok: false,
            error: `Course ${code} is not in the portal catalog (portal_courses).`,
        };
    }
    await insertLegacyPortalCourseSeed(db, seed);
    const again = await findPortalCourseIdsByCode(db, code);
    if (again.length === 1) {
        return { ok: true, courseId: again[0] };
    }
    if (again.length > 1) {
        return {
            ok: false,
            error: `Course code ${code} matches multiple portal courses.`,
        };
    }
    return {
        ok: false,
        error: `Could not resolve portal catalog row for ${code}.`,
    };
}
//# sourceMappingURL=portalCourseRepository.js.map