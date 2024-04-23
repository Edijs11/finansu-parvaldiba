const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { incomeShema } from '@/app/income/createIncomeForm';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const id = params.id;
//   const income = await prisma.income.findUnique({
//     where: {
//       incomeId: Number(id),
//     },
//   });

//   if (!income) {
//     return NextResponse.json({ error: 'Income not found' }, { status: 404 });
//   }
//   return NextResponse.json(income);
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
    const inputIncome = incomeShema.parse(body);
    const income = await prisma.income.update({
      where: {
        id: { id: Number(params.id) },
      },
      data: {
        name: inputIncome.name,
        amount: Number(inputIncome.amount),
        date: inputIncome.date,
        type: inputIncome.type,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(income), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'error editing income' }), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const inputIncome = incomeShema.parse(body);
    const income = await prisma.income.update({
      where: {
        id: { id: Number(params.id) },
      },
      data: {
        name: inputIncome.name,
        amount: Number(inputIncome.amount),
        date: inputIncome.date,
        type: inputIncome.type,
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

    const deleteIncome = await prisma.income.delete({
      where: {
        incomeId: Number(id),
      },
    });
    return NextResponse.json(deleteIncome, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting income' },
      { status: 500 }
    );
  }
}
