'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { incomeType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { savingGoalShema } from '../lib/shemas';
import { useEffect, useState } from 'react';
import axios from 'axios';

type TCreateSavingGoalShema = z.infer<typeof savingGoalShema>;
const EditSavingGoalForm = ({ id }: { id: number }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateSavingGoalShema>({
    resolver: zodResolver(savingGoalShema),
  });

  const getCurrentSavingGoal = async () => {
    try {
      const current = await axios.get(`${apiUrl}/api/savinggoal/${id}`);
      return current.data;
    } catch {
      new Error('could not get the current user');
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentSavingGoal();
        reset(data);
      } catch {
        new Error('cant get data');
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit: SubmitHandler<TCreateSavingGoalShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resp = await axios.put(`${apiUrl}/api/savinggoal/${id}`, data);
      reset();
    } catch {
      new Error('could not submit');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <p>Name:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Name"
        className="text-black rounded-sm"
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}

      <p className="mt-2">Saved:</p>
      <input
        {...register('saved', { valueAsNumber: true })}
        type="number"
        placeholder="Saved"
        step="0.01"
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

      <p className="mt-2">End Date:</p>
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
        Edit Saving Goal
      </button>
      {/* <button onClick={() => setIsCreateModalOpen(true)}></button> */}
    </form>
  );
};
export default EditSavingGoalForm;
