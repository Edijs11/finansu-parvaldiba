'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { incomeType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { incomeShema } from '../lib/shemas';
import { useEffect, useState } from 'react';
import axios from 'axios';

type TCreateIncomeShema = z.infer<typeof incomeShema>;
const EditIncomeForm = ({ id }: { id: number }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateIncomeShema>({
    resolver: zodResolver(incomeShema),
  });

  const getCurrentIncome = async () => {
    try {
      const current = await axios.get(`${apiUrl}/api/income/${id}`);
      return current.data;
    } catch {
      new Error('could not get the current user');
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentIncome();
        reset(data);
      } catch {
        new Error('cant get data');
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit: SubmitHandler<TCreateIncomeShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resp = await axios.put(`${apiUrl}/api/income/${id}`, data);
      reset();
    } catch {
      new Error('could not submit');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center -mt-8">Rediģēt ienākumu</h1>
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

      <p className="mt-2">Amount:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        placeholder="Apjoms"
        step="0.01"
        className="text-black rounded-sm"
      />
      {errors.amount && (
        <p className="text-red-500">{`${errors.amount.message}`}</p>
      )}

      <p className="mt-2">Date:</p>
      <input
        {...register('date')}
        type="date"
        className="text-black rounded-sm"
        required
      />
      <p className="mt-2">Tips:</p>
      <select {...register('type')} className="text-black rounded-sm" required>
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
        Edit Income
      </button>
      {/* <button onClick={() => setIsCreateModalOpen(true)}></button> */}
    </form>
  );
};
export default EditIncomeForm;
