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

interface Expense {
  expenseId: number;
  name: string;
  description: string;
  amount: number;
  date: Date;
  type: expenseType;
  userId: number;
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
    type: 'FOOD_GROCERIES',
    userId: 1,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expenseId, setExpenseId] = useState(0);
  // const [updateExpense, setUpdateExpense] = useState({
  //   id: '',
  //   name: '',
  // });

  const expenseTypeColors: { [key in expenseType]: string } = {
    [expenseType.FOOD_GROCERIES]: '#FFFF00',
    [expenseType.TRANSPORT]: '#FF5735',
    [expenseType.UTILITIES]: '#1E7000',
    [expenseType.HEALTHCARE]: '#96FF33',
    [expenseType.REPAIR]: '#8884d9',
    [expenseType.INSURANCE]: '#8A5A31',
    [expenseType.HOUSING]: '#008DA9',
    [expenseType.ENTERTAINMENT]: '#FFA500',
    [expenseType.OTHER]: '#D3D3D3',
  };

  expenses.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleEdit = (id: number) => {
    setIsEditModalOpen(true);
    setExpenseId(id);
  };

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

  let height;
  let width;
  if (expenses.length >= 20) {
    height = 400;
    width = 1000;
  } else {
    height = 300;
    width = 500;
  }

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  const formatedExpenses = useMemo(() => {
    return expenses.map((expense) => ({
      ...expense,
      date: formatDate(expense.date),
    }));
  }, [expenses]);

  const expenseTypeAndCount: { type: expenseType; amount: number }[] = [];

  expenses.forEach((expense) => {
    const existingType = expenseTypeAndCount.findIndex(
      (item) => item.type === expense.type
    );
    if (existingType !== -1) {
      expenseTypeAndCount[existingType].amount += expense.amount;
    } else {
      expenseTypeAndCount.push({ type: expense.type, amount: expense.amount });
    }
  });

  const createExpense = async (expense: Expense) => {
    try {
      const response = await axios.post(`${apiUrl}/api/expense`, expense);
      setExpenses([response.data, ...expenses]);
      setNewExpense({
        expenseId: 1,
        name: '',
        description: '',
        amount: 0,
        date: new Date(),
        type: 'FOOD_GROCERIES',
        userId: 1,
      });
    } catch (error) {
      console.error('Error creating expense:', error);
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
  //varbut var more efficient
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
  //vajag ar monthly avg ar last month
  let precentageChangeFromLastMonth =
    ((calcTotalExpense(expensesCurrentMonth) -
      calcTotalExpense(expensesLastMonth)) /
      calcTotalExpense(expensesLastMonth)) *
    100;

  var tooltip: string;
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
            )}`}</p>
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
      {confirmDelete && (
        <DeleteModal
          id={deleteId}
          confirmDelete={deleteExpense}
          onClose={() => setConfirmDelete(false)}
        />
      )}

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateExpenseForm onCreateExpense={createExpense} />
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <EditExpenseForm id={expenseId} />
        </Modal>
      )}

      {expenses.length ? (
        <div className="mt-6  max-w-full">
          <Frame title="Monthly expenses">
            <div className="mt-2 text-2xl">
              Current: {calcTotalExpense(expensesCurrentMonth)}
            </div>

            <div className="mt-2 text-lg">
              {calcTotalExpense(expensesLastMonth) === 0 ? (
                ''
              ) : (
                <div>Last: {calcTotalExpense(expensesLastMonth)}</div>
              )}
            </div>
            <p
              className={`text-sm ${
                precentageChangeFromLastMonth > 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {precentageChangeFromLastMonth.toFixed(2)}%
            </p>
          </Frame>
        </div>
      ) : (
        ''
      )}

      {expenses.length ? (
        <div className="mt-6 max-w-full">
          <Frame title="Expenses">
            <BarChart width={width} height={height} data={[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              {/* <Legend /> */}
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                data={formatedExpenses}
                onMouseOver={() => (tooltip = 'amount')}
              >
                {formatedExpenses.map((expense, index) => (
                  <Cell key={index} fill={expenseTypeColors[expense.type]} />
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
          <Frame title="Types">
            <PieChart width={500} height={400} className="-mt-6">
              <Legend />
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={expenseTypeAndCount}
                dataKey="amount"
                nameKey="type"
                // cx="50%"
                // cy="50%"
                // outerRadius={100}
                fill="#8884d8"
                onMouseOver={() => (tooltip = 'amount')}
              >
                {expenseTypeAndCount.map((expense, index) => (
                  <Cell
                    key={`cell-${index}`}
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
        <button
          className="p-2 bg-green-500 hover:bg-green-600 rounded text-white mt-6 w-[120px] place-self-end"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add expense
        </button>
        <table>
          <thead className="border-b border-gray-400">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formatedExpenses.toReversed().map((expense) => (
              <tr key={expense.expenseId} className="hover:bg-slate-800">
                <td>{expense.name}</td>
                <td className="w-60 overflow-hidden overflow-ellipsis break-all">
                  {/*  hover:break-all -jafixo */}
                  {expense.description}
                </td>

                <td className="px-4 py-2">{expense.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{expense.type}</td>
                <td className="px-4 py-2">{expense.date.toString()}</td>
                <td className="px-2 py-2">
                  <button
                    className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]"
                    onClick={() => handleEdit(expense.expenseId)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(expense.expenseId)}
                    className="bg-red-500 hover:bg-red-600 rounded text-white p-2 w-[70px]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-between">
      <h1 className="mt-6">You must be logged in!</h1>
      <LoginLink className="mt-4">Login</LoginLink>
    </div>
  );
};
export default Expense;
