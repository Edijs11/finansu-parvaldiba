const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: { transactionId: string };
  }
) {
  try {
    const transactionId = Number(params.transactionId);

    const transaction = await prisma.transaction.findUnique({
      where: {
        transactionId: transactionId,
      },
      select: { savingId: true, amount: true },
    });

    const { savingId, amount } = transaction;
    await prisma.savingGoal.update({
      where: { savingId: savingId },
      data: {
        saved: { decrement: amount },
      },
    });
    const deleteTransaction = await prisma.transaction.delete({
      where: {
        transactionId: transactionId,
      },
    });

    return NextResponse.json(deleteTransaction, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting transaction' },
      { status: 500 }
    );
  }
}
