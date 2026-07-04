-- Add schoolId to Subject from linked programs
ALTER TABLE "Subject" ADD COLUMN "schoolId" INTEGER;

UPDATE "Subject" s
SET "schoolId" = sub."schoolId"
FROM (
  SELECT DISTINCT ON (ps."subjectId")
    ps."subjectId",
    p."schoolId"
  FROM "ProgramSubject" ps
  INNER JOIN "Program" p ON p."id" = ps."programId"
  ORDER BY ps."subjectId", ps."programId"
) sub
WHERE s."id" = sub."subjectId";

DELETE FROM "Subject" WHERE "schoolId" IS NULL;

ALTER TABLE "Subject" ALTER COLUMN "schoolId" SET NOT NULL;

-- Drop global unique constraints
DROP INDEX IF EXISTS "Subject_name_key";
DROP INDEX IF EXISTS "Program_name_key";

-- Add school-scoped unique constraints
CREATE UNIQUE INDEX "Subject_schoolId_name_key" ON "Subject"("schoolId", "name");
CREATE UNIQUE INDEX "Program_schoolId_name_key" ON "Program"("schoolId", "name");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
