-- Add teacher color, school logo and subject abbreviation

ALTER TABLE "Teacher"
  ADD COLUMN IF NOT EXISTS "color" TEXT;

ALTER TABLE "School"
  ADD COLUMN IF NOT EXISTS "logo" TEXT;

ALTER TABLE "Subject"
  ADD COLUMN IF NOT EXISTS "abbrevation" TEXT NOT NULL DEFAULT '';

