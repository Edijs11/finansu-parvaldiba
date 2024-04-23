const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { savingGoalShema } from '../route';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const id = params.id;
//   const savingGoal = await prisma.savingGoal.findUnique({
//     where: {
//       savingGoalId: Number(id),
//     },
//   });

//   if (!savingGoal) {
//     return NextResponse.json({ error: 'savingGoal not found' }, { status: 404 });
//   }
//   return NextResponse.json(savingGoal);
// }

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const inputSavingGoal = savingGoalShema.parse(body);
    const savingGoal = await prisma.savingGoal.update({
      where: {
        id: { id: Number(params.id) },
      },
      data: {
        name: inputSavingGoal.name,
        amount: Number(inputSavingGoal.amount),
        saved: Number(inputSavingGoal.amount),
        startDate: inputSavingGoal.startDate,
        endDate: inputSavingGoal.endDate,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(savingGoal), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'error editing savingGoal' }),
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const inputSavingGoal = savingGoalShema.parse(body);
    const income = await prisma.income.update({
      where: {
        id: { id: Number(params.id) },
      },
      data: {
        name: inputSavingGoal.name,
        amount: Number(inputSavingGoal.amount),
        saved: Number(inputSavingGoal.amount),
        startDate: inputSavingGoal.startDate,
        endDate: inputSavingGoal.endDate,
        userId: 1,
      },
    });
    return new NextResponse(JSON.stringify(income), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'error editing income' }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const deleteSavingGoal = await prisma.savingGoal.delete({
      where: {
        savingId: Number(id),
      },
    });
    return NextResponse.json(deleteSavingGoal, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting savingGoal' },
      { status: 500 }
    );
  }
}