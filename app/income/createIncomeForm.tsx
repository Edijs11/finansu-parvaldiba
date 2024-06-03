'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { incomeType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { incomeShema } from '../lib/shemas';
import { CreateIncome } from './page';

interface CreateIncomeProps {
  onCreateIncome: (income: CreateIncome) => Promise<void>;
}
type TCreateIncomeShema = z.infer<typeof incomeShema>;

const CreateIncomeForm = ({ onCreateIncome }: CreateIncomeProps) => {
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
      await onCreateIncome(data);
      reset();
    } catch (error) {
      new Error('Failed to submit');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center -mt-8">Pievienot Ienākumu</h1>
      <p className="mt-4">Nosaukums:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Nosaukums"
        className="text-black rounded-sm"
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}

      <p className="mt-2">Apjoms:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        step="0.01"
        placeholder="0.00"
        className="text-black rounded-sm"
      />
      {errors.amount && (
        <p className="text-red-500">{`${errors.amount.message}`}</p>
      )}

      <p className="mt-2">Datums:</p>
      <input
        {...register('date')}
        type="date"
        className="text-black rounded-sm"
      />

      <p className="mt-2">Tips:</p>
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
        Pievienot ienākumu
      </button>
    </form>
  );
};
export default CreateIncomeForm;
