-- CreateTable
CREATE TABLE "Year" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Year_name_key" ON "Year"("name");

INSERT INTO "Year" ("id", "name", "createdAt", "updatedAt") VALUES
  (1, '1. letnik', NOW(), NOW()),
  (2, '2. letnik', NOW(), NOW()),
  (3, '3. letnik', NOW(), NOW()),
  (4, '4. letnik', NOW(), NOW());

SELECT setval(pg_get_serial_sequence('"Year"', 'id'), (SELECT MAX(id) FROM "Year"));

-- CreateTable
CREATE TABLE "ProgramYear" (
    "programId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,
    "numWeeks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramYear_pkey" PRIMARY KEY ("programId","yearId")
);

-- Backfill ProgramYear (1. letnik) for existing programs
INSERT INTO "ProgramYear" ("programId", "yearId", "numWeeks", "createdAt", "updatedAt")
SELECT p."id", 1, 35, NOW(), NOW()
FROM "Program" p;

-- Add yearId to ProgramSubject (existing rows → 1. letnik)
ALTER TABLE "ProgramSubject" ADD COLUMN "yearId" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "ProgramSubject" DROP CONSTRAINT "ProgramSubject_pkey";
ALTER TABLE "ProgramSubject" ADD CONSTRAINT "ProgramSubject_pkey" PRIMARY KEY ("programId", "subjectId", "yearId");

ALTER TABLE "ProgramSubject" ALTER COLUMN "yearId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "ProgramYear" ADD CONSTRAINT "ProgramYear_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProgramYear" ADD CONSTRAINT "ProgramYear_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProgramSubject" ADD CONSTRAINT "ProgramSubject_programId_yearId_fkey" FOREIGN KEY ("programId", "yearId") REFERENCES "ProgramYear"("programId", "yearId") ON DELETE RESTRICT ON UPDATE CASCADE;
