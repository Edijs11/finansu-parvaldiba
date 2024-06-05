import ContactEmail from '@/app/contactus/contactEmail';
import prisma from '@/app/lib/db';
import { email } from '@/app/lib/shemas';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const userEmail = dbUser?.email;
    const body = await req.json();
    const emailInput = email.parse(body);

    if (
      !emailInput.type ||
      !emailInput.subject ||
      !emailInput.message ||
      !userEmail
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: 'financemanagement004@gmail.com',
      reply_to: userEmail,
      subject: emailInput.type,
      text: emailInput.message,
      // react: ContactEmail({emailInput.subject, emailInput.message})
    });

    if (error) {
      console.log(error);
      return NextResponse.json(
        { message: 'Failed to send email', error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent!', error },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'some error sending email' }),
      { status: 500 }
    );
  }
}
