const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { savingGoalShema } from '@/app/lib/shemas';
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

    const savingGoals = await prisma.savingGoal.findMany({
      where: { userId: dbUser.id },
    });

    const goalWithParsedAmount = savingGoals.map((goal: any) => ({
      ...goal,
      amount: parseFloat(goal.amount),
      saved: parseFloat(goal.saved),
    }));
    return NextResponse.json(goalWithParsedAmount);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'error getting saving goals' }),
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
      throw new Error('Something went wrong with authentication ' + user);
    }

    let dbUser = await prisma.user.findUnique({
      where: { kindeId: user.id },
    });

    const body = await req.json();
    const input = savingGoalShema.parse(body);
    const savingGoal = await prisma.savingGoal.create({
      data: {
        name: input.name,
        saved: Number(input.saved),
        amount: Number(input.amount),
        startDate: input.startDate,
        endDate: input.endDate,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(savingGoal), { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ error: 'Error posting savingGoal' }),
      { status: 500 }
    );
  }
}
