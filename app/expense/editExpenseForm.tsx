'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { expenseType, incomeType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { expenseShema } from '../lib/shemas';
import { useEffect, useState } from 'react';
import axios from 'axios';

type TCreateExpenseShema = z.infer<typeof expenseShema>;
const EditExpenseForm = ({ id }: { id: number }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateExpenseShema>({
    resolver: zodResolver(expenseShema),
  });

  const getCurrentExpense = async () => {
    try {
      const current = await axios.get(`${apiUrl}/api/expense/${id}`);
      return current.data;
    } catch {
      new Error('could not get the current expense');
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentExpense();
        reset(data);
      } catch {
        new Error('cant get data');
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit: SubmitHandler<TCreateExpenseShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const resp = await axios.put(`${apiUrl}/api/expense/${id}`, data);
      reset();
    } catch {
      new Error('could not submit');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Rediģēt izdevumu</h1>
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

      <p>Apraksts:</p>
      <input
        {...register('description')}
        type="text"
        placeholder="Apraksts"
        className="text-black rounded-sm"
      />
      {errors.description && (
        <p className="text-red-500">{`${errors.description.message}`}</p>
      )}

      <p className="mt-2">Apjoms:</p>
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

      <p className="mt-2">Datums:</p>
      <input
        {...register('date')}
        type="date"
        className="text-black rounded-sm"
        required
      />
      <p className="mt-2">Tips:</p>
      <select {...register('type')} className="text-black rounded-sm">
        {Object.values(expenseType).map((selectedType, index) => (
          <option key={index} value={selectedType}>
            {selectedType}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
      >
        Rediģēt izdevumu
      </button>
      {/* <button onClick={() => setIsCreateModalOpen(true)}></button> */}
    </form>
  );
};
export default EditExpenseForm;
