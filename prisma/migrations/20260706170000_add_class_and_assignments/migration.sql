-- ClassLabel
CREATE TABLE "ClassLabel" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "ClassLabel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClassLabel_label_key" ON "ClassLabel"("label");

INSERT INTO "ClassLabel" ("id", "label") VALUES
  (1, 'a'),
  (2, 'b'),
  (3, 'c'),
  (4, 'bt'),
  (5, 'at'),
  (6, 'cr'),
  (7, 'gr'),
  (8, 'tr');

SELECT setval(pg_get_serial_sequence('"ClassLabel"', 'id'), (SELECT MAX(id) FROM "ClassLabel"));

-- Class (oddelek per program + letnik + label)
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Class_programId_yearId_labelId_key" ON "Class"("programId", "yearId", "labelId");

ALTER TABLE "Class" ADD CONSTRAINT "Class_programId_fkey"
  FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Class" ADD CONSTRAINT "Class_programId_yearId_fkey"
  FOREIGN KEY ("programId", "yearId") REFERENCES "ProgramYear"("programId", "yearId") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Class" ADD CONSTRAINT "Class_labelId_fkey"
  FOREIGN KEY ("labelId") REFERENCES "ClassLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed demo classes: SSI/NPI/gimnazija → a,b,c or a,b; SPI → bt,at
INSERT INTO "Class" ("programId", "yearId", "labelId") VALUES
  -- 1 Gradbeni tehnik (SSI)
  (1, 1, 1), (1, 1, 2), (1, 1, 3),
  (1, 2, 1), (1, 2, 2),
  (1, 3, 1), (1, 3, 2),
  (1, 4, 1), (1, 4, 2),
  -- 2 Tehniška gimnazija
  (2, 1, 1), (2, 1, 2),
  -- 3 NPI
  (3, 1, 1), (3, 1, 2), (3, 2, 1), (3, 2, 2),
  -- 4–9 SPI
  (4, 1, 4), (4, 1, 5), (4, 2, 4), (4, 2, 5), (4, 3, 4), (4, 3, 5),
  (5, 1, 4), (5, 1, 5), (5, 2, 4), (5, 2, 5), (5, 3, 4), (5, 3, 5),
  (6, 1, 4), (6, 1, 5), (6, 2, 4), (6, 2, 5), (6, 3, 4), (6, 3, 5),
  (7, 1, 4), (7, 1, 5), (7, 2, 4), (7, 2, 5), (7, 3, 4), (7, 3, 5),
  (8, 1, 4), (8, 1, 5), (8, 2, 4), (8, 2, 5), (8, 3, 4), (8, 3, 5),
  (9, 1, 4), (9, 1, 5), (9, 2, 4), (9, 2, 5), (9, 3, 4), (9, 3, 5),
  -- 10 Okoljevarstveni tehnik (SSI)
  (10, 1, 1), (10, 1, 2), (10, 1, 3),
  (10, 2, 1), (10, 2, 2),
  (10, 3, 1), (10, 3, 2),
  (10, 4, 1), (10, 4, 2);

-- ClassSubjectAssignment
CREATE TABLE "ClassSubjectAssignment" (
    "classId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "ClassSubjectAssignment_pkey" PRIMARY KEY ("classId","programId","subjectId","yearId")
);

ALTER TABLE "ClassSubjectAssignment" ADD CONSTRAINT "ClassSubjectAssignment_classId_fkey"
  FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ClassSubjectAssignment" ADD CONSTRAINT "ClassSubjectAssignment_programId_subjectId_yearId_fkey"
  FOREIGN KEY ("programId", "subjectId", "yearId") REFERENCES "ProgramSubject"("programId", "subjectId", "yearId") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ClassSubjectAssignment" ADD CONSTRAINT "ClassSubjectAssignment_teacherId_fkey"
  FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate existing teacher assignments → first class (label 'a' or 'bt') per program year
INSERT INTO "ClassSubjectAssignment" ("classId", "programId", "subjectId", "yearId", "teacherId")
SELECT c."id", ps."programId", ps."subjectId", ps."yearId", ps."teacherId"
FROM "ProgramSubject" ps
JOIN LATERAL (
  SELECT cl."id"
  FROM "Class" cl
  JOIN "ClassLabel" lbl ON lbl."id" = cl."labelId"
  WHERE cl."programId" = ps."programId"
    AND cl."yearId" = ps."yearId"
  ORDER BY CASE
    WHEN lbl."label" = 'a' THEN 1
    WHEN lbl."label" = 'bt' THEN 1
    ELSE 2
  END, cl."id"
  LIMIT 1
) c ON true
WHERE ps."teacherId" IS NOT NULL;

-- Drop teacher from curriculum table
ALTER TABLE "ProgramSubject" DROP CONSTRAINT IF EXISTS "ProgramSubject_teacherId_fkey";
ALTER TABLE "ProgramSubject" DROP COLUMN IF EXISTS "teacherId";

-- Drop legacy department tables if present
ALTER TABLE "ProgramSubject" DROP CONSTRAINT IF EXISTS "ProgramSubject_departmentId_fkey";
ALTER TABLE "ProgramSubject" DROP COLUMN IF EXISTS "departmentId";
DROP TABLE IF EXISTS "ProgramSubjectClass";
DROP TABLE IF EXISTS "Label";
