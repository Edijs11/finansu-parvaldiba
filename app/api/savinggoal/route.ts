const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const savingGoalShema = z.object({
  name: z.string().min(3).max(30),
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

  const savingGoals = await prisma.savingGoal.findMany({
    where: { userId: dbUser.id },
  });
  return NextResponse.json(savingGoals);
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
    const input = savingGoalShema.parse(body);
    // const { name, amount, date, type } = await req.json();
    const savingGoal = await prisma.savingGoal.create({
      data: {
        name: input.name,
        amount: Number(input.amount),
        saved: Number(input.saved),
        startDate: input.startDate,
        endDate: input.endDate,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(savingGoal), { status: 201 });
  } catch (error) {
    console.log('create error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'some error posting savingGoal' }),
      { status: 500 }
    );
  }
}
