import { z } from 'zod';

export const incomeShema = z.object({
  incomeId: z.number().optional(),
  name: z
    .string()
    .min(3, { message: 'Minimālais rakstzīmju daudzums ir 3' })
    .max(30, { message: 'Miksimālais rakstzīmju daudzums ir 30' }),
  amount: z.number().min(0, { message: 'Skaitlis nevar būt negatīvs' }),
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
    .min(3, { message: 'Minimālais rakstzīmju daudzums ir 3' })
    .max(30, { message: 'Maksimālais rakstzīmju daudzums ir 30' }),
  description: z
    .string()
    .max(250, { message: 'Maksimālais rakstzīmju daudzums ir 250' }),
  amount: z.number().min(0, { message: 'Skaitlis nevar būt negatīvs' }),
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
      .min(3, { message: 'Minimālais rakstzīmju daudzums ir 3' })
      .max(30, { message: 'Maksimālais rakstzīmju daudzums ir 30' }),
    amount: z.number().min(0, { message: 'Skaitlis nevar būt negatīvs' }),
    saved: z.number().min(0, { message: 'Skaitlis nevar būt negatīvs' }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    userId: z.number().optional(),
  })
  .refine((goal) => goal.startDate < goal.endDate, {
    message: 'Taupīšanas mērķa sākuma datumam jāsākas pirms tā beigu datama',
    path: ['startDate'],
  })
  .refine((goal) => goal.amount < goal.saved, {
    message: 'Mērķa ietaupītā summa nevar pārsniegt vēlamo mērķa summu',
    path: ['amount'],
  });

export const debtShema = z
  .object({
    debtId: z.number().optional(),
    name: z
      .string()
      .min(3, { message: 'Minimālais rakstzīmju daudzums ir 3' })
      .max(30, { message: 'Maksimālais rakstzīmju daudzums ir 30' }),
    amount: z.number().min(0, { message: 'Skaitlis nevar būt negatīvs' }),
    saved: z.number().min(0, { message: 'Skaitlis nevar būt negatīvs' }),
    interest_rate: z
      .number()
      .min(0, { message: 'Skaitlis nevar būt negatīvs' }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    userId: z.number().optional(),
  })
  .refine((debt) => debt.startDate < debt.endDate, {
    message: 'Parāda sākuma datumam jāsākas pirms tā beigu datama',
    path: ['startDate'],
  });

export const transactionShema = z.object({
  transactionId: z.number().optional(),
  amount: z.number().min(0, { message: 'Skaitlis nevar būt negatīvs' }),
  transactionDate: z.coerce.date(),
  savingGoalId: z.number().optional(),
});

export const email = z.object({
  subject: z
    .string()
    .min(3, 'Minimālais rakstzīmju daudzums ir 3')
    .max(30, { message: 'Maksimālais rakstzīmju daudzums ir 30' }),
  message: z
    .string()
    .min(5, 'Minimālais rakstzīmju daudzums ir 5')
    .max(500, { message: 'Maksimālais rakstzīmju daudzums ir 500' }),
});
