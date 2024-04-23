const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import { debtShema } from '../../debt/route';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const debt = await prisma.debt.findUnique({
    where: {
      debtId: Number(id),
    },
  });

  if (!debt) {
    return NextResponse.json({ error: 'Debt not found' }, { status: 404 });
  }
  return NextResponse.json(debt);
}

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json();
//     const inputDebt = createDebtShema.parse(body);
//     const debt = await prisma.debt.update({
//       where: {
//         id: { id: Number(params.id) },
//       },
//       data: {
//         name: inputDebt.name,
//         amount: Number(inputDebt.amount),
//         startDate: inputDebt.startDate,
//         endDate: inputDebt.endDate,
//         userId: 1,
//       },
//     });
//     return new NextResponse(JSON.stringify(debt), { status: 200 });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ error: 'error editing debt' }), {
//       status: 500,
//     });
//   }
// }

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
