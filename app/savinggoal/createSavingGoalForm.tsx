'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { savingGoalShema } from '../models/shemas';
import { CreateSavingGoal } from './page';

interface CreateSavingGoalProps {
  onCreateSavingGoal: (savingGoal: CreateSavingGoal) => Promise<void>;
}
type TCreateSavingGoalShema = z.infer<typeof savingGoalShema>;

const CreateSavingGoalForm = ({
  onCreateSavingGoal,
}: CreateSavingGoalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateSavingGoalShema>({
    resolver: zodResolver(savingGoalShema),
  });

  const onSubmit: SubmitHandler<TCreateSavingGoalShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onCreateSavingGoal(data);
      reset();
    } catch {
      throw new Error('Failed to submit saving goal');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Pievienot Taupīšanas Mērķi</h1>
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

      <p className="mt-2">Mērķa apjoms:</p>
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

      <p className="mt-2">Sākuma datums:</p>
      <input
        {...register('startDate')}
        type="date"
        className="text-black rounded-sm"
      />
      {errors.startDate && (
        <p className="text-red-500">{`${errors.startDate.message}`}</p>
      )}
      <p className="mt-2">Beigu datums:</p>
      <input
        {...register('endDate')}
        type="date"
        className="text-black rounded-sm"
      />
      {errors.endDate && (
        <p className="text-red-500">{`${errors.endDate.message}`}</p>
      )}

      <button
        type="submit"
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
      >
        Pievienot taupīšanas mērķi
      </button>
    </form>
  );
};
export default CreateSavingGoalForm;
