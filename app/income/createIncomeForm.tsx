'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Income, incomeType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { incomeShema } from '../lib/shemas';

export type TCreateIncomeShema = z.infer<typeof incomeShema>;

// interface IncomeProps {
//   onCreateIncome: (income: Income) => Promise<Income>;
// }
// interface incomeProps {
//   name: string;
//   amount: number;
//   date: Date;
//   type: incomeType;
// }

const CreateIncomeForm = ({ onCreateIncome }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateIncomeShema>({
    resolver: zodResolver(incomeShema),
  });

  const onSubmit: SubmitHandler<TCreateIncomeShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.post(`${apiUrl}/api/income`, data);
      await onCreateIncome(data);
      reset();
    } catch {
      new Error('this is bad');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center -mt-8">Add Income</h1>
      <p className="mt-4">Name:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Name"
        className="text-black rounded-sm"
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}

      <p className="mt-2">Amount:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        step="0.01"
        placeholder="Amount"
        className="text-black rounded-sm"
      />
      {errors.amount && (
        <p className="text-red-500">{`${errors.amount.message}`}</p>
      )}

      <p className="mt-2">Date:</p>
      <input
        {...register('date')}
        type="date"
        className="text-black rounded-sm"
        required
      />
      <p className="mt-2">Type:</p>
      <select {...register('type')} className="text-black rounded-sm">
        {Object.values(incomeType).map((selectedType, index) => (
          <option key={index} value={selectedType}>
            {selectedType}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
      >
        Add Income
      </button>

      {/* <button onClick={() => setIsCreateModalOpen(true)}></button> */}
    </form>
  );
};
export default CreateIncomeForm;
