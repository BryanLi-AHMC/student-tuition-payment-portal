/**
 * Legacy `students` table: `id` matches portal registration id (e.g. C17310).
 */
export async function findLegacyStudentById(pool, studentId) {
    const [rows] = await pool.query("SELECT id, name FROM students WHERE id = ? LIMIT 1", [studentId]);
    const row = rows[0];
    if (!row)
        return null;
    return {
        id: String(row.id),
        name: row.name == null ? "" : String(row.name),
    };
}
//# sourceMappingURL=studentLegacyAuthRepository.js.map