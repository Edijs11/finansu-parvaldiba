'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { debtShema } from '../lib/shemas';
import axios from 'axios';

type TCreateDebtShema = z.infer<typeof debtShema>;

const CreateDebtForm = ({ onCreateDebt }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateDebtShema>({
    resolver: zodResolver(debtShema),
  });

  const onSubmit: SubmitHandler<TCreateDebtShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.post(`${apiUrl}/api/debt`, data);
      onCreateDebt(data);
      reset();
    } catch {
      new Error('this is bad');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Pievienot Parādu</h1>
      <p className="mt-4">Nosaukums:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Nosaukums"
        className="text-black rounded-sm"
        required
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}

      <p className="mt-2">Ietaupītais apjoms:</p>
      <input
        {...register('saved', { valueAsNumber: true })}
        type="number"
        step="0.01"
        placeholder="Ietaupītais apjoms"
        className="text-black rounded-sm"
      />
      {errors.saved && (
        <p className="text-red-500">{`${errors.saved.message}`}</p>
      )}

      <p className="mt-2">Procentu likme:</p>
      <input
        {...register('interest_rate', { valueAsNumber: true })}
        type="number"
        placeholder="Procentu likme"
        className="text-black rounded-sm"
      />
      {errors.interest_rate && (
        <p className="text-red-500">{`${errors.interest_rate.message}`}</p>
      )}

      <p className="mt-2">Sākuma datums:</p>
      <input
        {...register('startDate')}
        type="date"
        className="text-black rounded-sm"
        required
      />
      <p className="mt-2">Beigu datums:</p>
      <input
        {...register('endDate')}
        type="date"
        className="text-black rounded-sm"
        required
      />

      <button
        type="submit"
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
      >
        Pievienot parādu
      </button>
    </form>
  );
};

export default CreateDebtForm;
