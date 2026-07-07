CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

INSERT INTO "Category" ("id", "name", "createdAt", "updatedAt") VALUES
  (1, 'Splošnoizobraževalni predmeti', NOW(), NOW()),
  (2, 'Strokovni moduli', NOW(), NOW()),
  (3, 'Odprti kurikul', NOW(), NOW());

SELECT setval(pg_get_serial_sequence('"Category"', 'id'), (SELECT MAX(id) FROM "Category"));

ALTER TABLE "Subject" ADD COLUMN "categoryId" INTEGER;

UPDATE "Subject" SET "categoryId" = 1
WHERE name IN (
  'Slovenščina', 'Matematika', 'Tuji jezik', 'Športna vzgoja', 'Družboslovje',
  'Naravoslovje', 'Umetnost', 'Fizika', 'Kemija', 'Informatika', 'Zgodovina',
  'Biologija', 'Geografija', 'Sociologija', 'Zdrav način življenja'
);

UPDATE "Subject" SET "categoryId" = 3
WHERE name IN (
  'Interesne dejavnosti', 'Novi materiali v gradbeništvu', '3D oblikovanje v AutoCADu',
  'Sanacija in vzdrževanje zgradb', 'Učinkovita raba energije',
  'Projektiranje gradbenih inženirskih objektov',
  'Gradbena ekonomika in operativno planiranje',
  'Izdelava projektne dokumentacije'
);

UPDATE "Subject" SET "categoryId" = 2
WHERE "categoryId" IS NULL;

ALTER TABLE "Subject" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "Subject" ADD CONSTRAINT "Subject_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
