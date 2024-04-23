'use client';

import { incomeType, User } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
// import UserComponent from './components/IncomeComponent';

interface Debt {
  debtId: number;
  name: string;
  amount: number;
  saved: number;
  startDate: Date;
  endDate: Date;
  user: User;
}

export default function Debt() {
  const apiUrl = 'http://localhost:3000';
  const [debts, setDebts] = useState<Debt[]>([]);
  const [newDebt, setNewDebt] = useState({
    name: '',
    amount: 0,
    saved: 0,
    startDate: '',
    endDate: '',
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

  const createDebt = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/debt`, newDebt);
      setDebts([response.data, ...debts]);
      setNewDebt({ name: '', amount: 0, saved: 0, startDate: '', endDate: '' });
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

  return (
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
              value={newDebt.startDate}
              onChange={(e) =>
                setNewDebt({ ...newDebt, startDate: e.target.value })
              }
            />
            <p className="mt-2">End date:</p>
            <input
              type="date"
              className="text-black"
              value={newDebt.endDate}
              onChange={(e) =>
                setNewDebt({ ...newDebt, endDate: e.target.value })
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
            {debts.map((debt) => (
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
  );
}
