import { PrismaClient } from '@prisma/client';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user == null || !user.id) {
    throw new Error('Something went wrong with authentication' + user);
  }

  let dbUser = await prisma.user.findUnique({
    where: { kindeId: user.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        kindeId: user.id,
        email: user.email ?? '',
      },
    });
  }

  return NextResponse.redirect('http://localhost:3000');
}
