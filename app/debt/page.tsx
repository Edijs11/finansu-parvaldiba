'use client';

import { incomeType, User } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
import { number } from 'zod';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
// import UserComponent from './components/IncomeComponent';

interface Debt {
  debtId: number;
  name: string;
  amount: number;
  saved: number;
  startDate: Date;
  endDate: Date;
  userId: number;
}

export default function Debt() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = 'http://localhost:3000';
  const [debts, setDebts] = useState<Debt[]>([]);
  const [newDebt, setNewDebt] = useState<Debt>({
    debtId: 1,
    name: '',
    amount: 0,
    saved: 0,
    startDate: new Date(),
    endDate: new Date(),
    userId: 1,
  });
  const [updateDebt, setUpdateDebt] = useState({
    name: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDebt = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/debt`);
        setDebts(response.data.reverse());
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchDebt();
  }, [newDebt]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  const formatedDebts = debts.map((debt) => ({
    ...debt,
    startDate: formatDate(debt.startDate),
    endDate: formatDate(debt.endDate),
  }));

  const createDebt = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/debt`, newDebt);
      setDebts([response.data, ...debts]);
      setNewDebt({
        debtId: 1,
        name: '',
        amount: 0,
        saved: 0,
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
      });
    } catch (error) {
      console.error('Error creating debt:', error);
    }
  };

  const deleteDebt = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/debt/${id}`);
      setDebts(debts.filter((debt) => debt.debtId != id));
    } catch (error) {
      console.error('Error deleting debt:', error);
    }
  };

  if (isLoading) return <div>Loading..</div>;
  return isAuthenticated ? (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h1>Add Debt</h1>
          <form onSubmit={createDebt} className="flex flex-col mt-2 ">
            <p>Name:</p>
            <input
              type="text"
              className="text-black"
              value={newDebt.name}
              placeholder="Name"
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
            />
            <p className="mt-2">Saved:</p>
            <input
              type="number"
              className="text-black"
              value={newDebt.amount}
              onChange={(e) =>
                setNewDebt({ ...newDebt, amount: Number(e.target.value) })
              }
            />
            <p className="mt-2">Target amount:</p>
            <input
              type="number"
              className="text-black"
              value={newDebt.saved}
              onChange={(e) =>
                setNewDebt({ ...newDebt, saved: Number(e.target.value) })
              }
            />
            <p className="mt-2">Start date:</p>
            <input
              type="date"
              className="text-black"
              value={newDebt.startDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setNewDebt({ ...newDebt, startDate: new Date(e.target.value) })
              }
            />
            <p className="mt-2">End date:</p>
            <input
              type="date"
              className="text-black"
              value={newDebt.endDate.toISOString().split('T')[0]}
              onChange={(e) =>
                setNewDebt({ ...newDebt, endDate: new Date(e.target.value) })
              }
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
            >
              Add Debt
            </button>
            <button onClick={() => setIsModalOpen(true)}></button>
          </form>
        </Modal>
      )}

      <div className="mt-6 flex flex-col">
        <button
          className="p-2 bg-green-500 hover:bg-green-600 rounded text-white mt-6 w-[100px] place-self-end"
          onClick={() => setIsModalOpen(true)}
        >
          Add Debt
        </button>
        <table>
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Saved</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
            </tr>
          </thead>
          <tbody>
            {formatedDebts.map((debt) => (
              <tr key={debt.debtId}>
                <td className="px-4 py-2">{debt.name}</td>
                <td className="px-4 py-2">{debt.amount}</td>
                <td className="px-4 py-2">{debt.saved}</td>
                <td className="px-4 py-2">{debt.startDate.toString()}</td>
                <td className="px-4 py-2">{debt.endDate.toString()}</td>
                <td className="px-4 py-2">
                  <button className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]">
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => deleteDebt(debt.debtId)}
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
