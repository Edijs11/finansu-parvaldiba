const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { expenseShema } from '../../models/shemas';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user == null || !user.id) {
      throw new Error('Something went wrong with authentication' + user);
    }

    let dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
    });

    const expenses = await prisma.expense.findMany({
      where: {
        userId: dbUser.id,
      },
    });
    const expensesWithParsedAmount = expenses.map((expense: any) => ({
      ...expense,
      amount: parseFloat(expense.amount),
    }));
    return NextResponse.json(expensesWithParsedAmount);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'error getting expenses' }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user == null || !user.id) {
      throw new Error('Something went wrong with authentication' + user);
    }

    let dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
    });

    const body = await req.json();
    const input = expenseShema.parse(body);
    const expense = await prisma.expense.create({
      data: {
        name: input.name,
        description: input.description,
        amount: Number(input.amount),
        date: input.date,
        type: input.type,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(expense), { status: 201 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'some error posting expense' }),
      { status: 500 }
    );
  }
}
