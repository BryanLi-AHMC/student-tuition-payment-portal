/**
 * TranscriptRecord = display-ready academic history (normalized titles, sorted). Derived from attempt-shaped rows;
 * not the system source of truth for registration or degree progress.
 *
 * Sources: `marks` + `clinic` (clinic lines for transcript narrative only — not didactic earned units here).
 * Do not compute degree audit or merge clinical hours into academic units in this service.
 */
import type { StudentTranscriptPreviewResponse } from "../types/studentTranscript.js";
export declare function getStudentTranscriptPreviewPayload(studentId: string): Promise<StudentTranscriptPreviewResponse>;
//# sourceMappingURL=studentTranscriptService.d.ts.map