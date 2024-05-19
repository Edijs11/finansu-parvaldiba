-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_debtId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_savingGoalId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "savingGoalId" DROP NOT NULL,
ALTER COLUMN "debtId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_savingGoalId_fkey" FOREIGN KEY ("savingGoalId") REFERENCES "SavingGoal"("savingId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("debtId") ON DELETE SET NULL ON UPDATE CASCADE;
