const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { transactionShema } from '../../../../models/shemas';
import { TransactionType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const transactions = await prisma.transaction.findMany({
      where: {
        debtId: id,
        type: TransactionType.DEBT,
      },
    });

    if (!transactions) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(transactions);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'error getting transactions' }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const input = transactionShema.parse(body);
    const transaction = await prisma.transaction.create({
      data: {
        debtId: id,
        amount: input.amount,
        date: input.transactionDate,
        type: TransactionType.DEBT,
      },
    });

    const debt = await prisma.debt.findUnique({
      where: {
        debtId: id,
      },
    });

    await prisma.debt.update({
      where: {
        debtId: debt.debtId,
      },
      data: {
        saved: { increment: input.amount },
      },
    });

    return new NextResponse(JSON.stringify(transaction), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'some error posting transaction' }),
      { status: 500 }
    );
  }
}
