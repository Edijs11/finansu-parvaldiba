const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const debtShema = z.object({
  name: z.string().min(3).max(20),
  amount: z.number().min(0),
  saved: z.number().min(0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
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

  const debts = await prisma.debt.findMany({
    where: {
      userId: dbUser.id,
    },
  });

  return NextResponse.json(debts);
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
    // const { name, amount, date, type } = await req.json();
    const debt = await prisma.debt.create({
      data: {
        name: input.name,
        amount: Number(input.amount),
        saved: Number(input.saved),
        startDate: input.startDate,
        endDate: input.endDate,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(debt), { status: 201 });
  } catch (error) {
    console.log('create error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'some error posting debt' }),
      { status: 500 }
    );
  }
}
