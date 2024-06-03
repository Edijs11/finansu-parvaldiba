'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { incomeType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { debtShema } from '../lib/shemas';
import { useEffect } from 'react';

type TCreateDebtShema = z.infer<typeof debtShema>;
const EditDebtForm = ({ updateDebt, onEditDebt }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateDebtShema>({
    resolver: zodResolver(debtShema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        reset(updateDebt);
      } catch {
        new Error('could not get the debt');
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit: SubmitHandler<TCreateDebtShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onEditDebt(data.debtId, data);
    } catch {
      new Error('could not submit debt');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Rediģēt Parādu</h1>
      <p>Nosaukums:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Nosaukums"
        className="text-black rounded-sm"
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}

      <p className="mt-2">Ietaupītais apjoms:</p>
      <input
        {...register('saved', { valueAsNumber: true })}
        type="number"
        placeholder="Ietaupītais apjoms"
        step="0.01"
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
        Rediģēt parādu
      </button>
    </form>
  );
};
export default EditDebtForm;
