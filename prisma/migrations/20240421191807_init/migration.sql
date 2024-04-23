/*
  Warnings:

  - The primary key for the `Debt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `savingId` on the `Debt` table. All the data in the column will be lost.
  - The primary key for the `Expense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expenceId` on the `Expense` table. All the data in the column will be lost.
  - Made the column `endDate` on table `Debt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Expense` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Income` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `SavingGoal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Debt" DROP CONSTRAINT "Debt_pkey",
DROP COLUMN "savingId",
ADD COLUMN     "debtId" SERIAL NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL,
ADD CONSTRAINT "Debt_pkey" PRIMARY KEY ("debtId");

-- AlterTable
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_pkey",
DROP COLUMN "expenceId",
ADD COLUMN     "expenseId" SERIAL NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ADD CONSTRAINT "Expense_pkey" PRIMARY KEY ("expenseId");

-- AlterTable
ALTER TABLE "Income" ALTER COLUMN "date" SET NOT NULL;

-- AlterTable
ALTER TABLE "SavingGoal" ALTER COLUMN "endDate" SET NOT NULL;
