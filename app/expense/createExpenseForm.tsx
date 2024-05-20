'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { expenseType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { expenseShema } from '../lib/shemas';

type TCreateExpenseShema = z.infer<typeof expenseShema>;

const CreateExpenseForm = ({ onCreateExpense }: any) => {
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
      onCreateExpense(data);
      reset();
    } catch {
      new Error('this is bad');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-2">
      <h1 className="text-xl place-self-center">Pievienot izdevumu</h1>
      <p className="mt-4">Nosaukums:</p>
      <input
        {...register('name')}
        type="text"
        placeholder="Nosaukums"
        className="text-black rounded-sm"
        required //ja pareizi saprotu tad uz .nonempty zod shema
      />
      {errors.name && (
        <p className="text-red-500">{`${errors.name.message}`}</p>
      )}
      <p className="mt-4">Apraksts:</p>
      <textarea
        {...register('description')}
        placeholder="Apraksts"
        className="text-black rounded-sm"
        rows={2}
        wrap="hard"
      />
      {errors.description && (
        <p className="text-red-500">{`${errors.description.message}`}</p>
      )}

      <p className="mt-2">Apjoms:</p>
      <input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        step="0.01"
        placeholder="Apjoms"
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
        Pievienot izdevumu
      </button>
      {/* <button onClick={() => setIsCreateModalOpen(true)}></button> */}
    </form>
  );
};
export default CreateExpenseForm;
