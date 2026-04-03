import { DEMO_STUDENT_ID } from "../config/constants.js";
import { pool } from "../lib/db.js";
import {
  listMarksForStudent,
  type MarksRow,
} from "../repositories/studentAcademicsRepository.js";
import type { StudentAcademicsResponse } from "../types/studentAcademics.js";
import {
  buildAcademicCourseRecordsFromMarks,
  buildAvailableTermsFromCourseRecords,
  courseRecordToEnrollmentItem,
  courseRecordToScheduleItem,
  courseRecordToTranscriptItem,
  resolveActiveTermFromCourseRecords,
  termsMatch,
} from "./studentAcademicCourseRecords.js";

function buildPayload(studentId: string, rows: MarksRow[]): StudentAcademicsResponse {
  if (rows.length === 0) {
    return {
      studentId,
      studentName: studentId,
      currentTerm: null,
      availableTerms: [],
      currentSchedule: [],
      transcript: [],
      enrollmentHistory: [],
      courseRecords: [],
    };
  }

  const nameFromMarks = rows[0]!.name.trim();
  const studentName = nameFromMarks.length > 0 ? nameFromMarks : studentId;
  const courseRecords = buildAcademicCourseRecordsFromMarks(studentId, rows);
  const currentTerm = resolveActiveTermFromCourseRecords(courseRecords);

  const currentSchedule =
    currentTerm == null
      ? []
      : courseRecords
          .filter(
            (r) =>
              r.year === currentTerm.year &&
              termsMatch(r.term, currentTerm.term),
          )
          .map(courseRecordToScheduleItem);

  return {
    studentId,
    studentName,
    currentTerm,
    availableTerms: buildAvailableTermsFromCourseRecords(courseRecords),
    currentSchedule,
    transcript: courseRecords.map(courseRecordToTranscriptItem),
    enrollmentHistory: courseRecords.map(courseRecordToEnrollmentItem),
    courseRecords,
  };
}

export async function getStudentAcademicsPayload(
  studentId: string,
): Promise<StudentAcademicsResponse> {
  const trimmed = studentId.trim();
  if (trimmed === "") {
    return {
      studentId: "",
      studentName: "",
      currentTerm: null,
      availableTerms: [],
      currentSchedule: [],
      transcript: [],
      enrollmentHistory: [],
      courseRecords: [],
    };
  }

  if (trimmed === DEMO_STUDENT_ID) {
    return {
      studentId: trimmed,
      studentName: trimmed,
      currentTerm: null,
      availableTerms: [],
      currentSchedule: [],
      transcript: [],
      enrollmentHistory: [],
      courseRecords: [],
    };
  }

  const rows = await listMarksForStudent(pool, trimmed);
  return buildPayload(trimmed, rows);
}
