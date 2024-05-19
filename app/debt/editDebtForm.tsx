'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { incomeType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { debtShema } from '../lib/shemas';
import { useEffect, useState } from 'react';
import axios from 'axios';

type TCreateDebtShema = z.infer<typeof debtShema>;
const EditDebtForm = ({ id }: { id: number }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateDebtShema>({
    resolver: zodResolver(debtShema),
  });

  const getCurrentDebt = async () => {
    try {
      const current = await axios.get(`${apiUrl}/api/debt/${id}`);
      return current.data;
    } catch {
      new Error('could not get the current debt');
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentDebt();
        reset(data);
      } catch {
        new Error('cant get data');
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit: SubmitHandler<TCreateDebtShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resp = await axios.put(`${apiUrl}/api/debt/${id}`, data);
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

      <p className="mt-2">Amount:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        placeholder="Amount"
        step="0.01"
        className="text-black rounded-sm"
      />
      {errors.amount && (
        <p className="text-red-500">{`${errors.amount.message}`}</p>
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
export default EditDebtForm;
