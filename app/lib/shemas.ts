import { z } from 'zod';
//models nevis iekš lib
//apskati .regex number to decimal
export const incomeShema = z.object({
  incomeId: z.number().optional(),
  name: z
    .string()
    .min(3, { message: 'Minimālais rakstzīmju daudzums ir 3' })
    .max(30, { message: 'Miksimālais rakstzīmju daudzums ir 30' }),
  amount: z
    .number()
    .min(1, { message: 'Ienākums nevar būt mazāks par 1' })
    .max(10000, { message: 'Ienākums nevar būt lielāks par 10000' }),
  date: z.coerce.date(),
  type: z.enum([
    'ALGA',
    'DIVIDENDES',
    'DAVANA',
    'VALSTS_PABALSTS',
    'NEKUSTAMAIS_IPASUMS',
    'PELNA',
    'HONORARS',
    'CITS',
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
  amount: z
    .number()
    .min(1, { message: 'Izdevums nevar būt mazāks par 1' })
    .max(10000, { message: 'Izdevums nevar būt lielāks par 10000' }),
  date: z.coerce.date(),
  type: z.enum([
    'PARTIKA',
    'IZKLAIDE',
    'PRECES_IEGADE',
    'TRANSPORTS',
    'VESELIBA',
    'APDROSINASANA',
    'MAJOKLIS',
    'REMONTS',
    'CITS',
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
    amount: z
      .number()
      .min(1, { message: 'Apjoms nevar būt mazāks par 1' })
      .max(10000, { message: 'Apjoms nevar būt lielāks par 10000' }),
    saved: z
      .number()
      .min(0, { message: 'Ietaupītā summa nevar būt negatīva' })
      .max(10000, { message: 'Ietaupījums nevar būt lielāks par 10000' }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    userId: z.number(),
  })
  .refine((goal) => goal.startDate < goal.endDate, {
    message: 'Taupīšanas mērķa sākuma datumam jāsākas pirms tā beigu datama',
    path: ['startDate'],
  });

// .refine((goal) => goal.amount < goal.saved, {
//   message: 'Mērķa ietaupītā summa nevar pārsniegt vēlamo mērķa summu',
//   path: ['amount'],
// });

export const debtShema = z
  .object({
    debtId: z.number().optional(),
    name: z
      .string()
      .min(3, { message: 'Minimālais rakstzīmju daudzums ir 3' })
      .max(30, { message: 'Maksimālais rakstzīmju daudzums ir 30' }),
    amount: z
      .number()
      .min(1, { message: 'Apjoms nevar būt mazāks par 1' })
      .max(10000, { message: 'Apjoms nevar būt lielāks par 10000' }),
    saved: z
      .number()
      .min(0, { message: 'Ietaupītā summa nevar būt negatīva' })
      .max(10000, { message: 'Ietaupījums nevar būt lielāks par 10000' }),
    interest_rate: z
      .number()
      .min(0, { message: 'Procentu likme nevar būt negatīva' })
      .max(100, { message: 'Procentu likme nevar pārsniegt 100%' }),
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
  amount: z
    .number()
    .min(0, { message: 'Skaitlis nevar būt negatīvs' })
    .max(10000, { message: 'Skaitlis nevar būt lielāks par 10000' }),
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
  type: z.string(),
});
