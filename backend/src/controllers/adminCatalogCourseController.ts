import type { Request, Response } from "express";
import { env } from "../config/env.js";
import {
  listCourseCategoryLookup,
  updateSchoolCourseBySequenceNumber,
} from "../repositories/courseCatalogWriteRepository.js";

function pathSequenceNumber(req: Request): number | null {
  const raw = req.params.sequenceNumber;
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(String(s ?? "").trim());
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}

function devMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/** GET /api/admin/course-categories — rows from `course_category` for catalog editors. */
export async function getAdminCourseCategories(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const rows = await listCourseCategoryLookup();
    res.json(rows);
  } catch (e) {
    console.error("[admin/course-categories] list failed:", e);
    const body: { error: string; message?: string } = {
      error: "Failed to load course categories.",
    };
    if (env.nodeEnv === "development") body.message = devMessage(e);
    res.status(500).json(body);
  }
}

type PatchBody = { units?: unknown; category?: unknown };

function parsePatchBody(body: unknown): {
  ok: true;
  patch: { units?: number; category?: string };
} | { ok: false; error: string } {
  if (body == null || typeof body !== "object") {
    return { ok: false, error: "JSON body required." };
  }
  const o = body as PatchBody;
  const out: { units?: number; category?: string } = {};

  if ("units" in o) {
    if (o.units === null) {
      return { ok: false, error: "units cannot be null." };
    }
    const n =
      typeof o.units === "number"
        ? o.units
        : typeof o.units === "string"
          ? Number(o.units.trim())
          : NaN;
    if (!Number.isFinite(n) || n < 0) {
      return { ok: false, error: "units must be a non-negative number." };
    }
    out.units = n;
  }

  if ("category" in o) {
    if (o.category === null || o.category === undefined) {
      out.category = "";
    } else if (typeof o.category === "string") {
      out.category = o.category.trim();
    } else {
      return { ok: false, error: "category must be a string." };
    }
  }

  if (out.units === undefined && out.category === undefined) {
    return {
      ok: false,
      error: "Provide at least one of: units, category.",
    };
  }

  return { ok: true, patch: out };
}

/** PATCH /api/admin/catalog/courses/:sequenceNumber — update `courses.units` / `courses.category`. */
export async function patchAdminCatalogCourse(
  req: Request,
  res: Response,
): Promise<void> {
  const seq = pathSequenceNumber(req);
  if (seq === null) {
    res.status(400).json({ error: "Invalid sequence number." });
    return;
  }

  const parsed = parsePatchBody(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  try {
    const result = await updateSchoolCourseBySequenceNumber(seq, parsed.patch);
    if (!result.ok) {
      const status = result.error === "Course not found." ? 404 : 400;
      res.status(status).json({ error: result.error });
      return;
    }
    res.json({ ok: true, affected: result.affected });
  } catch (e) {
    console.error("[admin/catalog/courses] patch failed:", e);
    const body: { error: string; message?: string } = {
      error: "Could not update this course.",
    };
    if (env.nodeEnv === "development") body.message = devMessage(e);
    res.status(500).json(body);
  }
}
