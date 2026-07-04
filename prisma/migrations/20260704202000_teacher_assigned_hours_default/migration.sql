-- Backfill existing nulls before making the column NOT NULL
UPDATE "Teacher" SET "assignedHours" = 0 WHERE "assignedHours" IS NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "assignedHours" SET DEFAULT 0,
ALTER COLUMN "assignedHours" SET NOT NULL;
