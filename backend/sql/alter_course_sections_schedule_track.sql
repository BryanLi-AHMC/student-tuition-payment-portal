-- Adds timetable grouping: same course_code may have parallel EN vs CN offered timetables per term/year.
-- Replaces uniqueness on (course_code, term, year, section_code) with a composite that includes schedule_track
-- so section_code "A" can exist once per track (e.g. EN-A and CN-A).
--
-- Safe to run once on existing DBs that already have course_sections + uq_course_sections_offer.

USE school;

ALTER TABLE course_sections
  ADD COLUMN schedule_track VARCHAR(16) NOT NULL DEFAULT 'EN'
    COMMENT 'Offered timetable group: EN or CN (not student identity)'
    AFTER section_code;

-- Explicit backfill (column default already EN; keeps intent obvious in migration logs)
UPDATE course_sections SET schedule_track = 'EN' WHERE schedule_track IS NULL OR TRIM(schedule_track) = '';

ALTER TABLE course_sections
  DROP INDEX uq_course_sections_offer,
  ADD UNIQUE KEY uq_course_sections_offer_track (course_code, term, year, schedule_track, section_code),
  ADD CONSTRAINT chk_course_sections_schedule_track CHECK (schedule_track IN ('EN', 'CN'));
