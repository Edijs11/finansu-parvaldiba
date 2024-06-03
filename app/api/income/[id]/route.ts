const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { incomeShema } from '@/app/lib/shemas';

export async function GET(
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

    const id = Number(params.id);
    const income = await prisma.income.findUnique({
      where: {
        incomeId: id,
        userId: dbUser.id,
      },
    });

    if (!income) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    return NextResponse.json(income);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'error getting income' }), {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // const { getUser } = getKindeServerSession();
    // const user = await getUser();

    // if (!user || user == null || !user.id) {
    //   throw new Error('Something went wrong with authentication' + user);
    // }

    // let dbUser = await prisma.user.findUnique({
    //   where: { kindeId: user.id },
    // });
    const body = await req.json();
    const inputIncome = incomeShema.parse(body);
    const income = await prisma.income.update({
      where: {
        incomeId: inputIncome.incomeId,
      },
      data: {
        name: inputIncome.name,
        amount: Number(inputIncome.amount),
        date: inputIncome.date,
        type: inputIncome.type,
        userId: inputIncome.userId,
      },
    });
    return new NextResponse(JSON.stringify(income), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // const { getUser } = getKindeServerSession();
    // const user = await getUser();

    // if (!user || user == null || !user.id) {
    //   throw new Error('Something went wrong with authentication' + user);
    // }

    // let dbUser = await prisma.user.findUnique({
    //   where: { kindeId: user.id },
    // });
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
