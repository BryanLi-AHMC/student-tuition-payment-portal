/**
 * Student-facing clinical completion rows from legacy `clinic` only (grade P, raw hours).
 */

import type { Pool, RowDataPacket } from "mysql2/promise";

export type StudentClinicalProgressRecord = {
  code: string;
  courseTitle: string;
  term: string;
  year: number;
  grade: string;
  hours: number;
};

function str(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

function numHours(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Lists passed clinical rows and a summary from `clinic` (source of truth for this endpoint).
 */
export async function loadStudentClinicalProgressFromClinic(
  pool: Pool,
  studentId: string,
): Promise<{
  completedCount: number;
  totalHours: number;
  records: StudentClinicalProgressRecord[];
}> {
  const sid = studentId.trim();
  const baseWhere = `TRIM(id) = TRIM(?)
     AND UPPER(TRIM(grade)) = 'P'`;

  const [detailRows] = await pool.query<RowDataPacket[]>(
    `SELECT code,
            course_title,
            term,
            year,
            grade,
            hours
     FROM clinic
     WHERE ${baseWhere}
     ORDER BY \`year\`, term`,
    [sid],
  );

  const [sumRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS completedCount,
            COALESCE(SUM(hours), 0) AS totalHours
     FROM clinic
     WHERE ${baseWhere}`,
    [sid],
  );

  const sum = sumRows[0] as Record<string, unknown> | undefined;
  const completedCountRaw = Number(sum?.completedCount);
  const totalHoursRaw = Number(sum?.totalHours);

  const records: StudentClinicalProgressRecord[] = detailRows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      code: str(row.code),
      courseTitle: str(row.course_title),
      term: str(row.term),
      year: Number(row.year),
      grade: str(row.grade),
      hours: numHours(row.hours),
    };
  });

  return {
    completedCount: Number.isFinite(completedCountRaw)
      ? Math.trunc(completedCountRaw)
      : 0,
    totalHours: Number.isFinite(totalHoursRaw) ? totalHoursRaw : 0,
    records,
  };
}
