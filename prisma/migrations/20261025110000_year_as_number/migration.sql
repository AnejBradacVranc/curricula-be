-- AlterTable
ALTER TABLE "Year" ADD COLUMN "year" INTEGER;

-- Backfill from existing "1. letnik" names (or fall back to id)
UPDATE "Year"
SET "year" = COALESCE(
  NULLIF(substring(name from '^[0-9]+'), '')::INTEGER,
  id
);

ALTER TABLE "Year" ALTER COLUMN "year" SET NOT NULL;

DROP INDEX IF EXISTS "Year_name_key";
ALTER TABLE "Year" DROP COLUMN "name";
CREATE UNIQUE INDEX "Year_year_key" ON "Year"("year");
