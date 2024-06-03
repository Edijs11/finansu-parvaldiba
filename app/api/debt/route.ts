const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { debtShema } from '@/app/lib/shemas';
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

    const debts = await prisma.debt.findMany({
      where: {
        userId: dbUser.id,
      },
    });
    const debtsWithParsedAmount = debts.map((debt: any) => ({
      ...debt,
      saved: parseFloat(debt.saved),
      amount: parseFloat(debt.amount),
    }));

    return NextResponse.json(debtsWithParsedAmount);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'error getting debts' }), {
      status: 500,
    });
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
    const input = debtShema.parse(body);
    const debt = await prisma.debt.create({
      data: {
        name: input.name,
        amount: input.amount,
        saved: input.saved,
        interest_rate: input.interest_rate,
        startDate: input.startDate,
        endDate: input.endDate,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(debt), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'error posting debt' }), {
      status: 500,
    });
  }
}
