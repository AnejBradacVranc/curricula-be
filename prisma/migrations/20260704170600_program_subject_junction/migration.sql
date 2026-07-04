-- CreateTable
CREATE TABLE "ProgramSubject" (
    "programId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "requiredHours" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramSubject_pkey" PRIMARY KEY ("programId","subjectId")
);

-- Migrate existing program-subject links
INSERT INTO "ProgramSubject" ("programId", "subjectId", "requiredHours", "createdAt", "updatedAt")
SELECT "programId", "id", "requiredHours", "createdAt", "updatedAt"
FROM "Subject";

-- Merge duplicate subject names into a single subject row
WITH keepers AS (
    SELECT "name", MIN("id") AS "keepId"
    FROM "Subject"
    GROUP BY "name"
),
duplicates AS (
    SELECT s."id" AS "duplicateId", k."keepId"
    FROM "Subject" s
    INNER JOIN keepers k ON s."name" = k."name"
    WHERE s."id" <> k."keepId"
)
UPDATE "ProgramSubject" ps
SET "subjectId" = d."keepId"
FROM duplicates d
WHERE ps."subjectId" = d."duplicateId";

DELETE FROM "Subject" s
USING (
    SELECT s2."id"
    FROM "Subject" s2
    INNER JOIN (
        SELECT "name", MIN("id") AS "keepId"
        FROM "Subject"
        GROUP BY "name"
    ) k ON s2."name" = k."name"
    WHERE s2."id" <> k."keepId"
) d
WHERE s."id" = d."id";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_programId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "programId",
DROP COLUMN "requiredHours";

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- AddForeignKey
ALTER TABLE "ProgramSubject" ADD CONSTRAINT "ProgramSubject_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSubject" ADD CONSTRAINT "ProgramSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
