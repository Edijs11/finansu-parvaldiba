const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { expenseShema } from '@/app/lib/shemas';

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
    const expense = await prisma.expense.findUnique({
      where: {
        expenseId: Number(id),
        userId: dbUser.id,
      },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json(expense);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'error getting expense' }),
      {
        status: 500,
      }
    );
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
    const inputExpense = expenseShema.parse(body);
    const expense = await prisma.expense.update({
      where: {
        expenseId: inputExpense.expenseId,
      },
      data: {
        name: inputExpense.name,
        description: inputExpense.description,
        amount: Number(inputExpense.amount),
        date: inputExpense.date,
        type: inputExpense.type,
        userId: dbUser.id,
      },
    });
    return new NextResponse(JSON.stringify(expense), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ error: 'error editing expense' }),
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
//     const inputExpense = expenseShema.parse(body);
//     const expense = await prisma.expense.update({
//       where: {
//         id: { id: Number(params.id) },
//       },
//       data: {
//         name: inputExpense.name,
//         amount: Number(inputExpense.amount),
//         date: inputExpense.date,
//         type: inputExpense.type,
//         userId: 1,
//       },
//     });
//     return new NextResponse(JSON.stringify(expense), { status: 200 });
//   } catch (error) {
//     return new NextResponse(
//       JSON.stringify({ error: 'error editing expense' }),
//       {
//         status: 500,
//       }
//     );
//   }
// }

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const deleteExpense = await prisma.expense.delete({
      where: {
        expenseId: Number(id),
      },
    });
    return NextResponse.json(deleteExpense, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting expense' },
      { status: 500 }
    );
  }
}
