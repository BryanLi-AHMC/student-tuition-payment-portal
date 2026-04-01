import type { Pool } from "mysql2/promise";
import type { AccountContext } from "../types/studentAccount.js";
/**
 * Latest term/year for which the student has at least one enrollment row.
 * Ordering: highest calendar year first, then Fall > Summer > Spring > Winter within the year.
 */
export declare function findLatestTermYearForStudent(pool: Pool, studentExternalId: string): Promise<{
    term: string;
    year: number;
} | null>;
export declare function loadAccountContext(pool: Pool, studentId: string, term: string, year: number): Promise<AccountContext | null>;
//# sourceMappingURL=studentAccountRepository.d.ts.map