'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { savingGoalShema } from '../lib/shemas';
import { useEffect } from 'react';

type TCreateSavingGoalShema = z.infer<typeof savingGoalShema>;
const EditSavingGoalForm = ({ savingGoalAction, onEditSavingGoal }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateSavingGoalShema>({
    resolver: zodResolver(savingGoalShema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        reset(savingGoalAction);
      } catch {
        new Error('could not get the saving goal');
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit: SubmitHandler<TCreateSavingGoalShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onEditSavingGoal(data.savingId, data);
    } catch {
      new Error('could not submit saving goal');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Rediģēt Taupīšanas Mērķi</h1>
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

      <p className="mt-2">Mērķa apjoms:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        placeholder="0.00"
        step="0.01"
        className="text-black rounded-sm"
      />
      {errors.amount && (
        <p className="text-red-500">{`${errors.amount.message}`}</p>
      )}

      <p className="mt-2">Start Date:</p>
      <input
        {...register('startDate')}
        type="date"
        className="text-black rounded-sm"
      />

      <p className="mt-2">Beigu datums:</p>
      <input
        {...register('endDate')}
        type="date"
        className="text-black rounded-sm"
      />

      <button
        type="submit"
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
      >
        Rediģēt taupīšanas mērķi
      </button>
    </form>
  );
};
export default EditSavingGoalForm;
