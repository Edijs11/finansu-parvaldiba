'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { transactionShema } from '../../../lib/shemas';
import axios from 'axios';

type TCreateTransactionShema = z.infer<typeof transactionShema>;

const CreateTransactionForm = ({ onCreateTransaction }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateTransactionShema>({
    resolver: zodResolver(transactionShema),
  });

  const onSubmit: SubmitHandler<TCreateTransactionShema> = async (data) => {
    try {
      console.log('create error:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onCreateTransaction(data);
      reset();
    } catch {
      new Error('this is bad');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Pievienot Transakciju</h1>
      <p className="mt-2">Apjoms:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        step="0.01"
        placeholder="Apjoms"
        className="text-black rounded-sm"
      />
      {errors.amount && (
        <p className="text-red-500">{`${errors.amount.message}`}</p>
      )}
      <p className="mt-2">Datums:</p>
      <input
        {...register('transactionDate')}
        type="date"
        className="text-black rounded-sm"
        required
      />

      <button
        type="submit"
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
      >
        Pievienot transakciju
      </button>
    </form>
  );
};
export default CreateTransactionForm;
