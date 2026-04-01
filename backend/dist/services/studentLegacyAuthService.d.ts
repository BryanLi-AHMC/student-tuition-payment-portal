import type { Pool } from "mysql2/promise";
export type LegacyLoginResult = {
    studentId: string;
    displayName: string;
};
/**
 * Last-name initial for legacy password derivation.
 * - If a comma exists: first character of the trimmed substring before the comma (uppercased).
 * - Else: first character of the first whitespace-delimited token (uppercased).
 * - If the comma branch yields an empty segment, fall back to the no-comma rule on the full trimmed name.
 */
export declare function deriveLastNameInitial(name: string): string | null;
/** Last 5 characters of trimmed id, or the full id when length < 5. */
export declare function legacyPasswordIdSuffix(studentId: string): string;
export declare function buildExpectedLegacyPassword(studentName: string, studentId: string): string | null;
export declare function authenticateLegacyStudent(pool: Pool, studentIdRaw: string, passwordRaw: string): Promise<LegacyLoginResult | null>;
//# sourceMappingURL=studentLegacyAuthService.d.ts.map