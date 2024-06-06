const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { incomeShema } from '../../models/shemas';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
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

    const incomeWithParsedAmount = incomes.map((income: any) => ({
      ...income,
      amount: parseFloat(income.amount),
    }));

    return NextResponse.json(incomeWithParsedAmount);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'error getting incomes' }),
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
    const inputIncome = incomeShema.parse(body);
    const income = await prisma.income.create({
      data: {
        name: inputIncome.name,
        amount: Number(inputIncome.amount),
        date: inputIncome.date,
        type: inputIncome.type,
        userId: dbUser.id,
      },
    });

    return new NextResponse(JSON.stringify(income), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'error posting income' }), {
      status: 500,
    });
  }
}
