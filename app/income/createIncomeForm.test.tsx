import { SubmitHandler } from 'react-hook-form';
import { expect, it, vi } from 'vitest';
import { TCreateIncomeShema } from './createIncomeForm';
import { beforeEach, describe } from 'node:test';

const mockOnCreateIncome = vi.fn();
const mockReset = vi.fn();

const onSubmit: SubmitHandler<TCreateIncomeShema> = async (data) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await mockOnCreateIncome(data);
    mockReset();
  } catch (error) {
    throw new Error('Failed to submit income');
  }
};

describe('onSubmit', () => {
  it('called onCreateIncome and reset the form', async () => {
    const incomeTestData: TCreateIncomeShema = {
      name: 'Alga',
      amount: 100,
      date: new Date(2023 - 12 - 31),
      type: 'ALGA',
      userId: 1,
    };

    await onSubmit(incomeTestData);

    expect(mockOnCreateIncome).toHaveBeenCalledWith(incomeTestData);
    expect(mockOnCreateIncome).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
