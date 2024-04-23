import { z } from 'zod';

export const incomeShema = z.object({
  name: z.string().min(3).max(30),
  amount: z.number().min(0),
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
