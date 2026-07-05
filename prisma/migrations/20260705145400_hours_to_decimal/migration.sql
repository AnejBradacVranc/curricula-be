-- AlterTable
ALTER TABLE "Program"
  ALTER COLUMN "availableHours" TYPE DECIMAL(8, 2) USING "availableHours"::decimal;

ALTER TABLE "ProgramSubject"
  ALTER COLUMN "requiredHours" TYPE DECIMAL(8, 2) USING "requiredHours"::decimal;

ALTER TABLE "Teacher"
  ALTER COLUMN "assignedHours" TYPE DECIMAL(8, 2) USING "assignedHours"::decimal;

ALTER TABLE "Teacher"
  ALTER COLUMN "assignedHours" SET DEFAULT 0;
