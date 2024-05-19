const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { incomeShema } from '@/app/lib/shemas';
// import { incomeShema } from '@/app/income/createIncomeForm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user == null || !user.id) {
    throw new Error('Something went wrong with authentication' + user);
  }

  let dbUser = await prisma.user.findUnique({
    where: { kindeId: user.id },
  });

  const incomes = await prisma.income.findMany({
    where: {
      userId: dbUser.id,
    },
  });
  return NextResponse.json(incomes);
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
    const input = incomeShema.parse(body);
    const income = await prisma.income.create({
      data: {
        name: input.name,
        amount: Number(input.amount),
        date: input.date,
        type: input.type,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(income), { status: 201 });
  } catch (error) {
    console.log('create error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'some error posting income' }),
      { status: 500 }
    );
  }
}
