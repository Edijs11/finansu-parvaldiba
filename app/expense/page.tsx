'use client';

import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { expenseType } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../components/modal';
import Frame from '../components/frame';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CreateExpenseForm from './createExpenseForm';
import DeleteModal from '../components/deleteModal';
import EditExpenseForm from './editExpenseForm';
import { formatDate } from '../components/functions';

interface Expense {
  expenseId: number;
  name: string;
  description: string;
  amount: number;
  date: Date;
  type: expenseType;
  userId: number;
}

export interface CreateExpense {
  name: string;
  description?: string;
  amount: number;
  date: Date;
  type: expenseType;
  userId?: number;
}

const Expense = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Expense>({
    expenseId: 1,
    name: '',
    description: '',
    amount: 0,
    date: new Date(),
    type: 'PARTIKA',
    userId: 1,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currMonth = () => {
    let now = new Date();
    now.setDate(1);
    const currentMonthFirstDate = now.toISOString().split('T')[0];
    return currentMonthFirstDate;
  };
  const [startDate, setStartDate] = useState(currMonth);
  const getLastDayOfMonth = () => {
    const now = new Date();
    let configureMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    configureMonth.setDate(configureMonth.getDate());
    let lastDayOfM = configureMonth.toISOString().split('T')[0];
    return lastDayOfM;
  };
  const [endDate, setEndDate] = useState(getLastDayOfMonth);

  const expenseTypeColors: { [key in expenseType]: string } = {
    [expenseType.PARTIKA]: '#FFFF00',
    [expenseType.TRANSPORTS]: '#FF5735',
    [expenseType.MAJOKLIS]: '#1E7000',
    [expenseType.REMONTS]: '#96FF33',
    [expenseType.IZKLAIDE]: '#8884d9',
    [expenseType.VESELIBA]: '#8A5A31',
    [expenseType.PRECES_IEGADE]: '#008DA9',
    [expenseType.APDROSINASANA]: '#FFA500',
    [expenseType.CITS]: '#D3D3D3',
  };

  expenses.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/expense`);
        setExpenses(response.data);
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchExpense();
  }, [newExpense]);

  let height: number;
  let width: number;
  if (expenses.length < 10) {
    height = 300;
    width = 500;
  } else if (expenses.length < 20) {
    height = 300;
    width = 800;
  } else {
    height = 400;
    width = 1200;
  }

  const formatedExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        return (
          new Date(expense.date).getTime() >= new Date(startDate).getTime() &&
          new Date(expense.date).getTime() <= new Date(endDate).getTime()
        );
      })
      .map((expense) => ({
        ...expense,
        date: formatDate(expense.date),
      }));
  }, [expenses, startDate, endDate]);

  const removeDateFilter = () => {
    const currentYear = new Date().getFullYear();
    setStartDate(new Date(currentYear, 0, 1 + 1).toISOString().split('T')[0]);
    setEndDate(new Date(currentYear, 11, 31 + 1).toISOString().split('T')[0]);
  };

  const expenseTypeAndCount: {
    id: number;
    type: expenseType;
    amount: number;
  }[] = [];

  let expenseTotalAmountId = 1;
  formatedExpenses.forEach((expense) => {
    const existingType = expenseTypeAndCount.findIndex(
      (item) => item.type === expense.type
    );
    if (existingType !== -1) {
      expenseTypeAndCount[existingType].amount += expense.amount;
    } else {
      expenseTypeAndCount.push({
        id: expenseTotalAmountId++,
        type: expense.type,
        amount: expense.amount,
      });
    }
  });

  const createExpense = async (expense: CreateExpense) => {
    try {
      const response = await axios.post(`${apiUrl}/api/expense`, expense);
      setExpenses([response.data, ...expenses]);
      setNewExpense({
        expenseId: 1,
        name: '',
        description: '',
        amount: 0,
        date: new Date(),
        type: 'PARTIKA',
        userId: 1,
      });
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const callEditModal = async (id: number) => {
    const current = await axios.get(`${apiUrl}/api/expense/${id}`);
    const formated = new Date(current.data.date).toISOString().split('T')[0];
    setNewExpense({ ...current.data, date: formated });
    setIsEditModalOpen(true);
    return current.data;
  };

  const editExpense = async (id: number, newExpense: Expense) => {
    try {
      await axios.put(`${apiUrl}/api/expense/${id}`, newExpense);
      setNewExpense(newExpense);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/expense/${id}`);
      setExpenses(expenses.filter((expense) => expense.expenseId != id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
    setConfirmDelete(false);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const getCurrentMonth = new Date().getMonth() + 1;
  const expensesCurrentMonth = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.getMonth() + 1;
    return expenseMonth === getCurrentMonth;
  });

  const getLastMonth = getCurrentMonth === 1 ? 12 : getCurrentMonth - 1;
  const expensesLastMonth = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.getMonth() + 1;
    return expenseMonth === getLastMonth;
  });

  const calcTotalExpense = (expenses: Expense[]): number => {
    return expenses.reduce((total, expense) => {
      return total + expense.amount;
    }, 0);
  };

  let precentageChangeFromLastMonth =
    ((calcTotalExpense(expensesLastMonth) -
      calcTotalExpense(expensesCurrentMonth)) /
      calcTotalExpense(expensesCurrentMonth)) *
    100;

  let tooltip: string;
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !tooltip) return null;
    for (const bar of payload) {
      if (bar.dataKey === tooltip) {
        return (
          <div className="bg-slate-600 p-4">
            <p>{payload[0].payload.date}</p>
            <p>{payload[0].payload.name}</p>
            <p>{`${payload[0].payload.type}: ${payload[0].value.toFixed(
              2
            )}€`}</p>
          </div>
        );
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center p-6">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125]" />
      </div>
    );
  return isAuthenticated ? (
    <div className="flex flex-col items-center justify-between">
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateExpenseForm onCreateExpense={createExpense} />
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <EditExpenseForm
            updateExpense={newExpense}
            onEditExpense={editExpense}
          />
        </Modal>
      )}

      {confirmDelete && (
        <DeleteModal
          id={deleteId}
          confirmDelete={deleteExpense}
          onClose={() => setConfirmDelete(false)}
        />
      )}

      {expenses.length ? (
        <div className="mt-6  max-w-full">
          <Frame title="Mēneša izmaksas">
            <div className="mt-2 text-2xl">
              Šis mēnesis: {calcTotalExpense(expensesCurrentMonth).toFixed(2)}€
            </div>

            <div className="mt-2 text-lg">
              {calcTotalExpense(expensesLastMonth) === 0 ? (
                ''
              ) : (
                <div>
                  <div>
                    Pagājušais: {calcTotalExpense(expensesLastMonth).toFixed(2)}
                    €
                  </div>
                  <div className="flex">
                    <p className="mr-2">Atšķirība:</p>
                    <p
                      className={`text-sm mt-1 ${
                        precentageChangeFromLastMonth > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {precentageChangeFromLastMonth.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Frame>
        </div>
      ) : (
        ''
      )}

      {formatedExpenses.length ? (
        <div className="mt-6 max-w-full">
          <Frame title="Izdevumi">
            <BarChart width={width} height={height} data={formatedExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" onMouseOver={() => (tooltip = 'amount')}>
                {formatedExpenses.map((expense) => (
                  <Cell
                    key={expense.expenseId}
                    fill={expenseTypeColors[expense.type]}
                  />
                ))}
              </Bar>
            </BarChart>
          </Frame>
        </div>
      ) : (
        ''
      )}
      {expenseTypeAndCount.length > 1 ? (
        <div className="mt-6 max-w-full">
          <Frame title="Tipu sadalījums">
            <PieChart width={500} height={400} className="-mt-6">
              <Legend />
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={expenseTypeAndCount}
                dataKey="amount"
                nameKey="type"
                fill="#8884d8"
                onMouseOver={() => (tooltip = 'amount')}
              >
                {expenseTypeAndCount.map((expense) => (
                  <Cell
                    key={`cell-${expense.id}`}
                    fill={expenseTypeColors[expense.type]}
                  />
                ))}
              </Pie>
            </PieChart>
          </Frame>
        </div>
      ) : (
        ''
      )}

      <div className="mt-6 flex flex-col  max-w-full">
        <h1 className="text-4xl">Izdevumi</h1>
        <button
          className="p-2 bg-green-500 hover:bg-green-600 rounded text-white mt-6 w-[120px] place-self-end"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Pievienot
        </button>
        <div className="flex justify-between place-self-end mt-2">
          <div className="mt-2">
            Diapazons:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mx-2 text-black rounded-sm"
            />
            -
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mx-2 text-black rounded-sm"
            />
            {startDate !== '' ? (
              <button
                onClick={removeDateFilter}
                className="ml-2 text-xl border w-[40px] rounded"
              >
                x
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
        <table>
          <thead className="border-b border-gray-400">
            <tr>
              <th className="px-4 py-2">Nosaukums</th>
              <th className="px-4 py-2">Apraksts</th>
              <th className="px-4 py-2">Apjoms</th>
              <th className="px-4 py-2">Tips</th>
              <th className="px-4 py-2">Datums</th>
              <th className="px-2 py-2">Darbības</th>
            </tr>
          </thead>
          <tbody>
            {formatedExpenses.toReversed().map((expense) => (
              <tr key={expense.expenseId} className="hover:bg-slate-800">
                <td>{expense.name}</td>
                <td className="w-60 overflow-hidden overflow-ellipsis break-all">
                  {expense.description}
                </td>

                <td className="px-4 py-2">{expense.amount}€</td>
                <td className="px-4 py-2">{expense.type}</td>
                <td className="px-4 py-2">{expense.date.toString()}</td>
                <td className="px-2 py-2">
                  <button
                    className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[75px]"
                    onClick={() => callEditModal(expense.expenseId)}
                  >
                    Rediģēt
                  </button>
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => handleDelete(expense.expenseId)}
                    className="bg-red-500 hover:bg-red-600 rounded text-white p-2 w-[70px]"
                  >
                    Dzēst
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center ">
        <h1>Jums nepieciešams pieslēgties, lai piekļūtu šai lapai!</h1>
        <LoginLink className="mt-4">Pieslēgties</LoginLink>
      </div>
    </div>
  );
};
export default Expense;
