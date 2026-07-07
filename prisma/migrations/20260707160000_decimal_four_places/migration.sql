ALTER TABLE "Program"
  ALTER COLUMN "availableHours" TYPE DECIMAL(8, 4) USING "availableHours"::decimal;

ALTER TABLE "ProgramSubject"
  ALTER COLUMN "requiredHours" TYPE DECIMAL(8, 4) USING "requiredHours"::decimal;

ALTER TABLE "Teacher"
  ALTER COLUMN "assignedHours" TYPE DECIMAL(8, 4) USING "assignedHours"::decimal;
