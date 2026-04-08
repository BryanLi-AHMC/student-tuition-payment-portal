import type { Request, Response } from "express";
/**
 * GET /api/admin/clinical/slots
 * Optional query: `academicTermId` or `academic_term_id` (portal academic_terms.id).
 */
export declare function getAdminClinicalSlotsHandler(req: Request, res: Response): Promise<void>;
/**
 * POST /api/admin/clinical/slots
 */
export declare function postAdminClinicalSlotHandler(req: Request, res: Response): Promise<void>;
/**
 * PATCH /api/admin/clinical/slots/:id
 */
export declare function patchAdminClinicalSlotHandler(req: Request, res: Response): Promise<void>;
/**
 * DELETE /api/admin/clinical/slots/:id
 */
export declare function deleteAdminClinicalSlotHandler(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=adminClinicalSlotController.d.ts.map