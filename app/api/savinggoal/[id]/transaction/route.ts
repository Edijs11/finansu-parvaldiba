const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { savingGoalShema, transactionShema } from '@/app/lib/shemas';
import { TransactionType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET({ params }: { params: { id: string } }) {
  const id = params.id;
  const transactions = await prisma.transaction.findMany({
    where: {
      savingGoalId: Number(id),
    },
  });

  if (!transactions) {
    return NextResponse.json(
      { error: 'Transaction not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(transactions);
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
        savingGoalId: id,
        amount: Number(input.amount),
        date: input.transactionDate,
        type: TransactionType.GOAL,
      },
    });

    const savingGoal = await prisma.savingGoal.findUnique({
      where: {
        savingId: id,
      },
    });
    //diezvai pareizi - priekš amount < saved
    // const goal = savingGoalShema.parse(savingGoal);

    await prisma.savingGoal.update({
      where: {
        savingId: savingGoal.savingId,
      },
      data: {
        amount: savingGoal.amount + input.amount,
      },
    });

    return new NextResponse(JSON.stringify(transaction), { status: 201 });
  } catch (error) {
    console.log('create error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'some error posting transaction' }),
      { status: 500 }
    );
  }
}
