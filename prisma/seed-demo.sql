-- Demo seed: Srednja gradbena šola in gimnazija Maribor
-- Izvedbeni predmetniki 2025/26 – all hour values are weekly (ur/teden).

BEGIN;

TRUNCATE "ProgramSubject", "Subject", "Program", "Teacher" RESTART IDENTITY CASCADE;

-- ─── Programs ───────────────────────────────────────────────────────────────
INSERT INTO "Program" (id, name, "schoolId", "availableHours", "createdAt", "updatedAt")
VALUES
  (1,  'Gradbeni tehnik', 3, 35.00, NOW(), NOW()),
  (2,  'Tehniška gimnazija', 3, 32.00, NOW(), NOW()),
  (3,  'Pomočnik pri tehnologiji gradnje', 3, 32.00, NOW(), NOW()),
  (4,  'Dimnikar', 3, 34.00, NOW(), NOW()),
  (5,  'Tesar', 3, 34.00, NOW(), NOW()),
  (6,  'Izvajalec suhomontažne gradnje', 3, 34.00, NOW(), NOW()),
  (7,  'Pečar – polagalec keramičnih oblog', 3, 34.00, NOW(), NOW()),
  (8,  'Slikopleskar – črkoslikar', 3, 34.00, NOW(), NOW()),
  (9,  'Zidar', 3, 34.00, NOW(), NOW()),
  (10, 'Okoljevarstveni tehnik', 3, 33.00, NOW(), NOW());

SELECT setval(pg_get_serial_sequence('"Program"', 'id'), (SELECT MAX(id) FROM "Program"));

-- ─── Subjects ───────────────────────────────────────────────────────────────
INSERT INTO "Subject" (id, name, "schoolId", "createdAt", "updatedAt")
VALUES
  (1,  'Slovenščina', 3, NOW(), NOW()),
  (2,  'Matematika', 3, NOW(), NOW()),
  (3,  'Tuji jezik', 3, NOW(), NOW()),
  (4,  'Športna vzgoja', 3, NOW(), NOW()),
  (5,  'Družboslovje', 3, NOW(), NOW()),
  (6,  'Naravoslovje', 3, NOW(), NOW()),
  (7,  'Umetnost', 3, NOW(), NOW()),
  (8,  'Gradbeništvo', 3, NOW(), NOW()),
  (9,  'Osnovna gradbena tehnologija', 3, NOW(), NOW()),
  (10, 'Strokovno risanje', 3, NOW(), NOW()),
  (11, 'Stavbarstvo', 3, NOW(), NOW()),
  (12, 'Osnove projektiranja', 3, NOW(), NOW()),
  (13, 'Gradbena mehanika', 3, NOW(), NOW()),
  (14, 'Gradbeni inženirski objekti', 3, NOW(), NOW()),
  (15, 'Fizika', 3, NOW(), NOW()),
  (16, 'Kemija', 3, NOW(), NOW()),
  (17, 'Informatika', 3, NOW(), NOW()),
  (18, 'Materiali in mehanika', 3, NOW(), NOW()),
  (19, 'Gradnja', 3, NOW(), NOW()),
  (20, 'Gradbeni elementi', 3, NOW(), NOW()),
  (21, 'Zidanje in ometavanje', 3, NOW(), NOW()),
  (22, 'Dimnikarstvo', 3, NOW(), NOW()),
  (23, 'Tesarstvo', 3, NOW(), NOW()),
  (24, 'Suhomontažna gradnja', 3, NOW(), NOW()),
  (25, 'Pečarstvo in polaganje keramičnih oblog', 3, NOW(), NOW()),
  (26, 'Slikopleskarstvo in črkoslikarstvo', 3, NOW(), NOW()),
  (27, 'Zidarska dela', 3, NOW(), NOW()),
  (28, 'Tehnologija dimnikarstva', 3, NOW(), NOW()),
  (29, 'Materiali v gradbeništvu', 3, NOW(), NOW()),
  (30, 'Zgodovina', 3, NOW(), NOW()),
  (31, 'Varstvo okolja', 3, NOW(), NOW()),
  (32, 'Tehnično risanje in uporaba računalnika', 3, NOW(), NOW()),
  (33, 'Materiali in okolje', 3, NOW(), NOW()),
  (34, 'Okoljevarstvene tehnologije', 3, NOW(), NOW()),
  (35, 'Biologija', 3, NOW(), NOW());

SELECT setval(pg_get_serial_sequence('"Subject"', 'id'), (SELECT MAX(id) FROM "Subject"));

-- ─── Program ↔ Subject (weekly hours, 1. letnik where applicable) ───────────

INSERT INTO "ProgramSubject" ("programId", "subjectId", "requiredHours", "createdAt", "updatedAt")
VALUES
  -- 1 Gradbeni tehnik (SSI)
  (1, 1, 4.00, NOW(), NOW()), (1, 2, 3.00, NOW(), NOW()), (1, 3, 3.00, NOW(), NOW()),
  (1, 4, 3.00, NOW(), NOW()), (1, 11, 4.00, NOW(), NOW()), (1, 12, 4.00, NOW(), NOW()),
  (1, 13, 3.00, NOW(), NOW()), (1, 14, 2.50, NOW(), NOW()),

  -- 2 Tehniška gimnazija
  (2, 1, 4.00, NOW(), NOW()), (2, 2, 4.00, NOW(), NOW()), (2, 3, 3.00, NOW(), NOW()),
  (2, 4, 3.00, NOW(), NOW()), (2, 15, 2.00, NOW(), NOW()), (2, 16, 2.00, NOW(), NOW()),
  (2, 17, 3.00, NOW(), NOW()), (2, 18, 2.50, NOW(), NOW()),

  -- 3 Pomočnik pri tehnologiji gradnje (NPI)
  (3, 1, 2.00, NOW(), NOW()), (3, 2, 3.00, NOW(), NOW()), (3, 5, 2.00, NOW(), NOW()),
  (3, 6, 2.00, NOW(), NOW()), (3, 4, 2.00, NOW(), NOW()),
  (3, 19, 9.00, NOW(), NOW()), (3, 20, 2.00, NOW(), NOW()), (3, 21, 7.00, NOW(), NOW()),

  -- 4 Dimnikar (SPI) – 1. letnik
  (4, 1, 3.00, NOW(), NOW()), (4, 2, 3.00, NOW(), NOW()), (4, 3, 2.00, NOW(), NOW()),
  (4, 7, 1.00, NOW(), NOW()), (4, 6, 2.00, NOW(), NOW()), (4, 5, 2.00, NOW(), NOW()),
  (4, 4, 2.00, NOW(), NOW()),
  (4, 8, 3.00, NOW(), NOW()), (4, 9, 4.00, NOW(), NOW()), (4, 10, 2.00, NOW(), NOW()),
  (4, 22, 4.00, NOW(), NOW()), (4, 28, 2.00, NOW(), NOW()), (4, 29, 2.00, NOW(), NOW()),

  -- 5 Tesar (SPI)
  (5, 1, 3.00, NOW(), NOW()), (5, 2, 3.00, NOW(), NOW()), (5, 3, 2.00, NOW(), NOW()),
  (5, 7, 1.00, NOW(), NOW()), (5, 6, 2.00, NOW(), NOW()), (5, 5, 2.00, NOW(), NOW()),
  (5, 4, 2.00, NOW(), NOW()),
  (5, 8, 3.00, NOW(), NOW()), (5, 9, 4.00, NOW(), NOW()), (5, 10, 2.00, NOW(), NOW()),
  (5, 23, 4.00, NOW(), NOW()), (5, 29, 2.00, NOW(), NOW()),

  -- 6 Izvajalec suhomontažne gradnje (SPI)
  (6, 1, 3.00, NOW(), NOW()), (6, 2, 3.00, NOW(), NOW()), (6, 3, 2.00, NOW(), NOW()),
  (6, 7, 1.00, NOW(), NOW()), (6, 6, 2.00, NOW(), NOW()), (6, 5, 2.00, NOW(), NOW()),
  (6, 4, 2.00, NOW(), NOW()),
  (6, 8, 3.00, NOW(), NOW()), (6, 9, 4.00, NOW(), NOW()), (6, 10, 2.00, NOW(), NOW()),
  (6, 24, 4.00, NOW(), NOW()), (6, 29, 2.00, NOW(), NOW()),

  -- 7 Pečar (SPI)
  (7, 1, 3.00, NOW(), NOW()), (7, 2, 3.00, NOW(), NOW()), (7, 3, 2.00, NOW(), NOW()),
  (7, 7, 1.00, NOW(), NOW()), (7, 6, 2.00, NOW(), NOW()), (7, 5, 2.00, NOW(), NOW()),
  (7, 4, 2.00, NOW(), NOW()),
  (7, 8, 3.00, NOW(), NOW()), (7, 9, 4.00, NOW(), NOW()), (7, 10, 2.00, NOW(), NOW()),
  (7, 25, 4.00, NOW(), NOW()), (7, 29, 2.00, NOW(), NOW()),

  -- 8 Slikopleskar – črkoslikar (SPI)
  (8, 1, 3.00, NOW(), NOW()), (8, 2, 3.00, NOW(), NOW()), (8, 3, 2.00, NOW(), NOW()),
  (8, 7, 1.00, NOW(), NOW()), (8, 6, 2.00, NOW(), NOW()), (8, 5, 2.00, NOW(), NOW()),
  (8, 4, 2.00, NOW(), NOW()),
  (8, 8, 3.00, NOW(), NOW()), (8, 9, 4.00, NOW(), NOW()), (8, 10, 2.00, NOW(), NOW()),
  (8, 26, 4.00, NOW(), NOW()), (8, 29, 2.00, NOW(), NOW()),

  -- 9 Zidar (SPI)
  (9, 1, 3.00, NOW(), NOW()), (9, 2, 3.00, NOW(), NOW()), (9, 3, 2.00, NOW(), NOW()),
  (9, 7, 1.00, NOW(), NOW()), (9, 6, 2.00, NOW(), NOW()), (9, 5, 2.00, NOW(), NOW()),
  (9, 4, 2.00, NOW(), NOW()),
  (9, 8, 3.00, NOW(), NOW()), (9, 9, 4.00, NOW(), NOW()), (9, 10, 2.00, NOW(), NOW()),
  (9, 27, 4.00, NOW(), NOW()), (9, 29, 2.00, NOW(), NOW()),

  -- 10 Okoljevarstveni tehnik (SSI) – 1. letnik
  (10, 1, 4.00, NOW(), NOW()), (10, 2, 3.00, NOW(), NOW()), (10, 3, 3.00, NOW(), NOW()),
  (10, 7, 2.00, NOW(), NOW()), (10, 30, 3.00, NOW(), NOW()),
  (10, 15, 2.00, NOW(), NOW()), (10, 16, 2.00, NOW(), NOW()), (10, 35, 2.00, NOW(), NOW()),
  (10, 4, 3.00, NOW(), NOW()),
  (10, 31, 5.00, NOW(), NOW()), (10, 32, 4.00, NOW(), NOW());

-- ─── Teachers ───────────────────────────────────────────────────────────────
INSERT INTO "Teacher" (id, name, surname, email, "schoolId", "assignedHours", "createdAt", "updatedAt")
VALUES
  (1, 'Majda', 'Drobnič', 'majda.drobnich@gradbena.si', 3, 18.00, NOW(), NOW()),
  (2, 'Riko', 'Vranc', 'riko.vranc@gradbena.si', 3, 24.00, NOW(), NOW()),
  (3, 'Goran', 'Perhavec', 'goran.perhavec@gradbena.si', 3, 22.00, NOW(), NOW());

SELECT setval(pg_get_serial_sequence('"Teacher"', 'id'), (SELECT MAX(id) FROM "Teacher"));

-- ─── Assignments (teacher on ProgramSubject) ─────────────────────────────────
UPDATE "ProgramSubject" SET "teacherId" = 1 WHERE "programId" = 1 AND "subjectId" = 1;

UPDATE "ProgramSubject" SET "teacherId" = 2 WHERE ("programId", "subjectId") IN (
  (1, 11), (1, 12), (1, 13), (4, 8), (3, 9), (4, 22), (5, 23), (9, 27)
);

UPDATE "ProgramSubject" SET "teacherId" = 3 WHERE ("programId", "subjectId") IN (
  (1, 14), (6, 24), (7, 25), (8, 26), (10, 31), (10, 34), (10, 32), (2, 17), (2, 15)
);

COMMIT;
