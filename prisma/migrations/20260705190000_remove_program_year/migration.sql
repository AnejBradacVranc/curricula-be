-- Remove ProgramYear and year columns from ProgramSubject
ALTER TABLE "ProgramSubject" DROP CONSTRAINT IF EXISTS "ProgramSubject_programId_year_fkey";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'ProgramSubject'
      AND column_name IN ('yearId', 'year')
  ) THEN
    ALTER TABLE "ProgramSubject" DROP CONSTRAINT "ProgramSubject_pkey";

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'ProgramSubject' AND column_name = 'yearId'
    ) THEN
      ALTER TABLE "ProgramSubject" DROP COLUMN "yearId";
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'ProgramSubject' AND column_name = 'year'
    ) THEN
      ALTER TABLE "ProgramSubject" DROP COLUMN "year";
    END IF;

    ALTER TABLE "ProgramSubject"
      ADD CONSTRAINT "ProgramSubject_pkey" PRIMARY KEY ("programId", "subjectId");
  END IF;
END $$;

DROP TABLE IF EXISTS "ProgramYear";
