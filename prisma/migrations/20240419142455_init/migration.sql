-- CreateEnum
CREATE TYPE "incomeType" AS ENUM ('SALARY', 'DIVIDENDS', 'GOVERMENT_ASSISTANCE', 'REALASTATE', 'BUSSINES_INCOME');

-- CreateEnum
CREATE TYPE "expenseType" AS ENUM ('FOOD_GROCERIES', 'TRANSPORT', 'HEALTHCARE', 'INSURANCE', 'HOUSING', 'ENTERTAINMENT', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "kindeId" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "incomeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3),
    "type" "incomeType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("incomeId")
);

-- CreateTable
CREATE TABLE "Expense" (
    "expenceId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3),
    "type" "expenseType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("expenceId")
);

-- CreateTable
CREATE TABLE "SavingGoal" (
    "savingId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "saved" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SavingGoal_pkey" PRIMARY KEY ("savingId")
);

-- CreateTable
CREATE TABLE "Debt" (
    "savingId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "saved" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("savingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_kindeId_key" ON "User"("kindeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingGoal" ADD CONSTRAINT "SavingGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
