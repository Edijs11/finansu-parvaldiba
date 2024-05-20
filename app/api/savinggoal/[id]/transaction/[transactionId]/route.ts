const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE({
  params,
}: {
  params: { transactionId: string };
}) {
  try {
    const transactionId = Number(params.transactionId);

    const transaction = await prisma.transaction.findUnique({
      where: {
        transactionId: transactionId,
      },
      select: { savingGoalId: true, amount: true },
    });

    const { savingGoalId, amount } = transaction;
    await prisma.savingGoal.update({
      where: { savingId: savingGoalId },
      data: {
        amount: { decrement: amount },
      },
    });
    const deleteTransaction = await prisma.transaction.delete({
      where: {
        transactionId: transactionId,
      },
    });

    return NextResponse.json(deleteTransaction, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error deleting transaction' },
      { status: 500 }
    );
  }
}
