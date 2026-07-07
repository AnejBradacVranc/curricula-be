-- Additional activities lookup
CREATE TABLE "AdditionalActivities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AdditionalActivities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdditionalActivities_name_key" ON "AdditionalActivities"("name");

INSERT INTO "AdditionalActivities" ("id", "name") VALUES
  (1, 'Razredništvo'),
  (2, 'Informatika'),
  (3, 'Matura'),
  (4, 'OIV'),
  (5, 'PUT');

SELECT setval(pg_get_serial_sequence('"AdditionalActivities"', 'id'), (SELECT MAX(id) FROM "AdditionalActivities"));

-- Teacher additional hours breakdown
ALTER TABLE "Teacher"
  ADD COLUMN "additionalActivityHours" DECIMAL(8, 4) NOT NULL DEFAULT 0,
  ADD COLUMN "totalHours" DECIMAL(8, 4) NOT NULL DEFAULT 0;

UPDATE "Teacher"
SET
  "additionalActivityHours" = 0,
  "totalHours" = "assignedHours";

-- Teacher ↔ additional activity assignments
CREATE TABLE "AdditionalTeacherAssignment" (
    "teacherId" INTEGER NOT NULL,
    "additionalActivityId" INTEGER NOT NULL,
    "hoursAmount" DECIMAL(8, 4) NOT NULL DEFAULT 0,

    CONSTRAINT "AdditionalTeacherAssignment_pkey" PRIMARY KEY ("teacherId", "additionalActivityId")
);

ALTER TABLE "AdditionalTeacherAssignment"
  ADD CONSTRAINT "AdditionalTeacherAssignment_teacherId_fkey"
    FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AdditionalTeacherAssignment"
  ADD CONSTRAINT "AdditionalTeacherAssignment_additionalActivityId_fkey"
    FOREIGN KEY ("additionalActivityId") REFERENCES "AdditionalActivities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
