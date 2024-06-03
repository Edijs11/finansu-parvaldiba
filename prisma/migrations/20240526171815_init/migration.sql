/*
  Warnings:

  - The values [DIVIDENTES] on the enum `incomeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "incomeType_new" AS ENUM ('ALGA', 'DIVIDENDES', 'DAVANA', 'VALSTS_PABALSTS', 'NEKUSTAMAIS_IPASUMS', 'PELNA', 'HONORARS', 'CITS');
ALTER TABLE "Income" ALTER COLUMN "type" TYPE "incomeType_new" USING ("type"::text::"incomeType_new");
ALTER TYPE "incomeType" RENAME TO "incomeType_old";
ALTER TYPE "incomeType_new" RENAME TO "incomeType";
DROP TYPE "incomeType_old";
COMMIT;
