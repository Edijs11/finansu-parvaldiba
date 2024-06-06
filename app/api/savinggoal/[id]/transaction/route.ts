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
        savingId: id,
        type: TransactionType.GOAL,
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
        savingId: id,
        amount: input.amount,
        date: input.transactionDate,
        type: TransactionType.GOAL,
      },
    });

    const savingGoal = await prisma.savingGoal.findUnique({
      where: {
        savingId: id,
      },
    });

    await prisma.savingGoal.update({
      where: {
        savingId: savingGoal.savingId,
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
