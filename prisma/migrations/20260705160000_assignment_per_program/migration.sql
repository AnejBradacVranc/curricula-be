-- Scope assignments to a specific program-subject pair.

DELETE FROM "SubjectTeacher";

ALTER TABLE "SubjectTeacher" DROP CONSTRAINT "SubjectTeacher_pkey";

ALTER TABLE "SubjectTeacher" ADD COLUMN "programId" INTEGER NOT NULL;

ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_programId_fkey"
  FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("programId", "subjectId");
