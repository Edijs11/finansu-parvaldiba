const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { NextResponse } from 'next/server';

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
      select: { debtId: true, amount: true },
    });

    const { debtId, amount } = transaction;
    await prisma.debt.update({
      where: { debtId: debtId },
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
    return NextResponse.json(
      { error: 'Error deleting transaction' },
      { status: 500 }
    );
  }
}
