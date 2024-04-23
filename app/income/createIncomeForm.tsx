'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { incomeType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { incomeShema } from '../lib/shemas';

export type TCreateIncomeShema = z.infer<typeof incomeShema>;

export default function IncomeForm() {
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

      // reset();
    } catch {
      new Error('this is bad');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <p>Name:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Name"
        className="text-black"
        required
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}

      <p className="mt-2">Amount:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        placeholder="Amount"
        className="text-black"
      />
      {errors.amount && (
        <p className="text-red-500">{`${errors.amount.message}`}</p>
      )}

      <p className="mt-2">Date:</p>
      <input
        {...register('date')}
        type="date"
        className="text-black"
        required
      />
      <p className="mt-2">Type:</p>
      <select {...register('type')} className="text-black" required>
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
}
