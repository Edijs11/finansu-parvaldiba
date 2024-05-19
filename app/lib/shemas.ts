import { z } from 'zod';

export const incomeShema = z.object({
  incomeId: z.number().optional(),
  name: z
    .string()
    .min(3, { message: 'Min characters are 3' })
    .max(30, { message: 'Max characters are 30' }),
  amount: z.number().min(0, { message: 'Number must be positive' }),
  date: z.coerce.date(),
  type: z.enum([
    'SALARY',
    'DIVIDENDS',
    'GOVERMENT_ASSISTANCE',
    'GIFT',
    'REALASTATE',
    'PROFIT_INCOME',
    'INTEREST_INCOME',
    'ROYALTY_INCOME',
    'OTHER',
  ]),
  userId: z.number().optional(),
});

export const expenseShema = z.object({
  expenseId: z.number().optional(),
  name: z
    .string()
    .min(3, { message: 'Min characters are 3' })
    .max(30, { message: 'Max characters are 30' }),
  description: z.string().max(250),
  amount: z.number().min(0),
  date: z.coerce.date(),
  type: z.enum([
    'FOOD_GROCERIES',
    'UTILITIES',
    'TRANSPORT',
    'HEALTHCARE',
    'INSURANCE',
    'HOUSING',
    'ENTERTAINMENT',
    'REPAIR',
    'OTHER',
  ]),
  userId: z.number().optional(),
});

export const savingGoalShema = z
  .object({
    savingId: z.number().optional(),
    name: z
      .string()
      .min(3, { message: 'Min characters are 3' })
      .max(30, { message: 'Max characters are 30' }),
    amount: z.number().min(0, { message: 'Min number is 0' }).default(0),
    saved: z.number().min(0),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    userId: z.number().optional(),
  })
  .refine((goal) => goal.startDate < goal.endDate, {
    message: 'Your start of the goal should be before the end date',
    path: ['startDate'],
  })
  .refine((goal) => goal.amount < goal.saved, {
    message: 'Amount cant be larger then saved amount',
    path: ['amount'],
  });

export const debtShema = z
  .object({
    debtId: z.number().optional(),
    name: z
      .string()
      .min(3, { message: 'Min characters are 3' })
      .max(30, { message: 'Max characters are 30' }),
    amount: z.number().min(0).default(0),
    saved: z.number().min(0),
    interest_rate: z.number().min(0).default(0),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    userId: z.number().optional(),
  })
  .refine((debt) => debt.startDate < debt.endDate, {
    message: 'Your start of the debt should be before the end date',
    path: ['startDate'],
  });

export const transactionShema = z.object({
  transactionId: z.number().optional(),
  amount: z.number().min(0).default(0),
  transactionDate: z.coerce.date(),
  savingGoalId: z.number().optional(),
});

export const email = z.object({
  subject: z.string().min(3).max(30, { message: 'Max characters are 30' }),
  message: z.string().min(5).max(500, { message: 'Max characters are 50' }),
});
