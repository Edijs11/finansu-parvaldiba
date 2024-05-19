'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { savingGoalShema } from '../lib/shemas';
import axios from 'axios';

type TCreateSavingGoalShema = z.infer<typeof savingGoalShema>;

const CreateSavingGoalForm = ({ onCreateSavingGoal }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
      // await axios.post(`${apiUrl}/api/savinggoal`, data);
      onCreateSavingGoal(data);
      reset();
    } catch {
      new Error('this is bad');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Add Saving Goal</h1>
      <p className="mt-4">Name:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Name"
        className="text-black rounded-sm"
        required
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}

      <p className="mt-2">Saved:</p>
      <input
        {...register('saved', { valueAsNumber: true })}
        type="number"
        step="0.01"
        placeholder="Saved"
        className="text-black rounded-sm"
      />
      {errors.saved && (
        <p className="text-red-500">{`${errors.saved.message}`}</p>
      )}

      <p className="mt-2">Start Date:</p>
      <input
        {...register('startDate')}
        type="date"
        className="text-black rounded-sm"
        required
      />
      {errors.startDate && (
        <p className="text-red-500">{`${errors.startDate.message}`}</p>
      )}
      <p className="mt-2">End Date:</p>
      <input
        {...register('endDate')}
        type="date"
        className="text-black rounded-sm"
        required
      />
      {errors.endDate && (
        <p className="text-red-500">{`${errors.endDate.message}`}</p>
      )}

      <button
        type="submit"
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
      >
        Add Saving Goal
      </button>
    </form>
  );
};
export default CreateSavingGoalForm;
