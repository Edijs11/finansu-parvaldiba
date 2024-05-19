'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { expenseType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { expenseShema } from '../lib/shemas';
import axios from 'axios';

type TCreateExpenseShema = z.infer<typeof expenseShema>;

const CreateExpenseForm = ({ onCreateExpense }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateExpenseShema>({
    resolver: zodResolver(expenseShema),
  });

  const onSubmit: SubmitHandler<TCreateExpenseShema> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await axios.post(`${apiUrl}/api/expense`, data);
      onCreateExpense(data);
      reset();
    } catch {
      new Error('this is bad');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Add Expense</h1>
      <p className="mt-4">Name:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Name"
        className="text-black rounded-sm"
        required //ja pareizi saprotu tad uz .nonempty zod shema
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}
      <p className="mt-4">Description:</p>
      <textarea
        {...register('description')}
        placeholder="Description"
        className="text-black rounded-sm"
        rows={2}
        wrap="hard"
      />
      {errors.description && (
        <p className="text-red-500">{`${errors.description.message}`}</p>
      )}

      <p className="mt-2">Amount:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        step="0.01"
        placeholder="Amount"
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
      <p className="mt-2">Type:</p>
      <select {...register('type')} className="text-black rounded-sm" required>
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
        Add Expense
      </button>
      {/* <button onClick={() => setIsCreateModalOpen(true)}></button> */}
    </form>
  );
};
export default CreateExpenseForm;
