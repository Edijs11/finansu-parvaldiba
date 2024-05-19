const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
import { debtShema } from '@/app/lib/shemas';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
        userId: inputDebt.userId,
      },
    });
    return new NextResponse(JSON.stringify(debt), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'error editing savingGoal' }),
      {
        status: 500,
      }
    );
  }
}

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json();
//     const inputIncome = createIncomeShema.parse(body);
//     const income = await prisma.income.update({
//       where: {
//         id: { id: Number(params.id) },
//       },
//       data: {
//         name: inputIncome.name,
//         amount: Number(inputIncome.amount),
//         date: inputIncome.date,
//         type: inputIncome.type,
//         userId: 1,
//       },
//     });
//     return new NextResponse(JSON.stringify(income), { status: 200 });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ error: 'error editing income' }), {
//       status: 500,
//     });
//   }
// }

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
    return NextResponse.json(
      { error: 'Error deleting income' },
      { status: 500 }
    );
  }
}
