-- Merge teacher assignment into ProgramSubject.

ALTER TABLE "ProgramSubject" ADD COLUMN "teacherId" INTEGER;

UPDATE "ProgramSubject" ps
SET "teacherId" = st."teacherId"
FROM "SubjectTeacher" st
WHERE ps."programId" = st."programId"
  AND ps."subjectId" = st."subjectId";

ALTER TABLE "ProgramSubject"
  ADD CONSTRAINT "ProgramSubject_teacherId_fkey"
  FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

DROP TABLE "SubjectTeacher";
