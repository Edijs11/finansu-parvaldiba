'use client';

import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { expenseType, User } from '@prisma/client';
import axios from 'axios';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
import Frame from '../components/frame';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CreateExpenseForm from './createExpenseForm';

interface Expense {
  expenseId: number;
  name: string;
  description: string;
  amount: number;
  date: Date;
  type: expenseType;
  userId: number;
}

export default function Expense() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const apiUrl = 'http://localhost:3000';
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
  // const [updateExpense, setUpdateExpense] = useState({
  //   id: '',
  //   name: '',
  // });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/expense`);
        setExpenses(response.data.reverse());
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchExpense();
  }, [newExpense]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  const formatedExpenses = expenses.map((expense) => ({
    ...expense,
    date: formatDate(expense.date),
  }));

  const createExpense = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/expense`, newExpense);
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
  };

  if (isLoading) return <div>Loading..</div>;
  return isAuthenticated ? (
    <div className="flex flex-col items-center justify-between">
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateExpenseForm />
          {/* <h1>Add Expense</h1>
          <form onSubmit={createExpense} className="flex flex-col mt-2">
            <p>Name:</p>
            <input
              type="text"
              value={newExpense.name}
              className="text-black"
              onChange={(e) =>
                setNewExpense({ ...newExpense, name: e.target.value })
              }
            />
            <p className="mt-2">Descirption:</p>
            <input
              type="text"
              value={newExpense.description}
              placeholder="Description"
              className="text-black"
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
            />
            <p className="mt-2">Amount:</p>
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              className="text-black"
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: Number(e.target.value) })
              }
            />
            <p className="mt-2">Date:</p>
            <input
              type="date"
              placeholder="Date"
              value={newExpense.date.toISOString().split('T')[0]}
              className="text-black"
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: new Date(e.target.value) })
              }
            />
            <p className="mt-2">Type:</p>
            <select
              className="text-black"
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  type: e.target.value as expenseType,
                })
              }
            >
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
          </form> */}
        </Modal>
      )}

      <div className="mt-6">
        <Frame title="Expenses">
          <BarChart
            width={400}
            height={250}
            data={formatedExpenses}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            // className="absolute inset-0"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar type="monotone" dataKey="amount" fill="#FF7F7F" />
          </BarChart>
        </Frame>
      </div>

      <div className="mt-6 flex flex-col">
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
            </tr>
          </thead>
          <tbody>
            {formatedExpenses.map((expense) => (
              <tr key={expense.expenseId}>
                <td className="px-4 py-2">{expense.name}</td>
                <td className="px-4 py-2">{expense.description}</td>
                <td className="px-4 py-2">{expense.amount}</td>
                <td className="px-4 py-2">{expense.type}</td>
                <td className="px-4 py-2">{expense.date.toString()}</td>
                <td>
                  <button className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]">
                    Edit
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteExpense(expense.expenseId)}
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
}
