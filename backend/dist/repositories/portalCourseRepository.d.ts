import type { Pool, PoolConnection } from "mysql2/promise";
type MysqlQueryable = Pool | PoolConnection;
export type PortalCourseBootstrapSummary = {
    totalCatalogCourses: number;
    missingBefore: number;
    inserted: number;
    mappedAfter: number;
};
export declare function ensurePortalCoursesForLegacyCatalog(db?: MysqlQueryable): Promise<PortalCourseBootstrapSummary>;
export declare function resolvePortalCourseIdByCourseCode(db: MysqlQueryable, courseCode: string): Promise<{
    ok: true;
    courseId: string;
} | {
    ok: false;
    error: string;
}>;
export {};
//# sourceMappingURL=portalCourseRepository.d.ts.map