import { z } from 'zod';

export const incomeShema = z.object({
  name: z
    .string()
    .min(3, { message: 'Min value is 3' })
    .max(30, { message: 'Max value is 30' }),
  amount: z.number().min(0, { message: 'Number must be positive' }),
  date: z.coerce.date(),
  type: z.enum([
    'SALARY',
    'DIVIDENDS',
    'GOVERMENT_ASSISTANCE',
    'REALASTATE',
    'BUSSINES_INCOME',
  ]),
  userId: z.number().optional(),
});

// export const incomeShema = z.object({
//   name: z.string().min(3).max(30, 'Name must be 3 to 30 characters long'),
//   amount: z.number().positive().min(1),
//   date: z.coerce.date(),
//   type: z.nativeEnum(incomeType),
//   userId: z.number(),
// });

export const expenseShema = z.object({
  name: z.string().min(3).max(20),
  description: z.string(),
  amount: z.number().min(0),
  date: z.coerce.date(),
  type: z.enum([
    'FOOD_GROCERIES',
    'TRANSPORT',
    'HEALTHCARE',
    'INSURANCE',
    'HOUSING',
    'ENTERTAINMENT',
    'OTHER',
  ]),
  userId: z.number().optional(),
});

export const savingGoalShema = z.object({
  name: z.string().min(3).max(30),
  amount: z.number().min(0),
  saved: z.number().min(0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  userId: z.number().optional(),
});
