const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const expenseShema = z.object({
  name: z.string().min(3).max(20),
  description: z.string(),
  amount: z.number().min(0),
  date: z.coerce.date(),
  type: z.enum([
    'FOOD_GROCERIES',
    'TRANSPORT',
    'HEALTHCARE',
    'INSURANCE',
    'HOUSING',
    'ENTERTAINMENT',
    'OTHER',
  ]),
  userId: z.number().optional(),
});

export async function GET() {
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
  return NextResponse.json(expenses);
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
    // const { name, amount, date, type } = await req.json();
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
    console.log('create error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'some error posting expense' }),
      { status: 500 }
    );
  }
}
