const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
import { debtShema } from '@/app/lib/shemas';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

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
    const id = params.id;
    const debt = await prisma.debt.findUnique({
      where: {
        debtId: Number(id),
        userId: dbUser.id,
      },
    });

    if (!debt) {
      return NextResponse.json({ error: 'Debt not found' }, { status: 404 });
    }
    return NextResponse.json(debt);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'error getting debt' }), {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
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
    const inputDebt = debtShema.parse(body);
    const debt = await prisma.debt.update({
      where: {
        debtId: inputDebt.debtId,
      },
      data: {
        name: inputDebt.name,
        amount: Number(inputDebt.amount),
        saved: Number(inputDebt.saved),
        startDate: inputDebt.startDate,
        endDate: inputDebt.endDate,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(debt), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'error editing debt' }), {
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

    const deleteDebt = await prisma.debt.delete({
      where: {
        debtId: Number(id),
      },
    });
    return NextResponse.json(deleteDebt, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting debt' }, { status: 500 });
  }
}
