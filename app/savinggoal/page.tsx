'use client';

import { User } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
// import UserComponent from './components/IncomeComponent';

interface SavingGoal {
  savingId: number;
  name: string;
  amount: number;
  saved: number;
  startDate: Date;
  endDate: Date;
  user: User;
}

export default function SavingGoal() {
  const apiUrl = 'http://localhost:3000';
  const [savingGaols, setSavingGoals] = useState<SavingGoal[]>([]);
  const [newSavingGoal, setNewSavingGoal] = useState({
    name: '',
    amount: 0,
    saved: 0,
    startDate: '',
    endDate: '',
  });
  const [updateSavingGoal, setUpdateSavingGoal] = useState({
    id: '',
    name: '',
    email: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSavingGoals = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/savinggoal`);
        setSavingGoals(response.data.reverse());
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchSavingGoals();
  }, [newSavingGoal]);

  const createSavingGoal = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/savinggoal`,
        newSavingGoal
      );
      setSavingGoals([response.data, ...savingGaols]);
      setNewSavingGoal({
        name: '',
        amount: 0,
        saved: 0,
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error('Error creating saving goal:', error);
    }
  };

  const deleteSavingGoal = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/savinggoal/${id}`);
      setSavingGoals(
        savingGaols.filter((savingGoal) => savingGoal.savingId != id)
      );
    } catch (error) {
      console.error('Error deleting saving goal:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="overflow-x-auto">
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <h1>Add Savings Goal</h1>
            <form onSubmit={createSavingGoal} className="flex flex-col mt-2 ">
              <p>Name:</p>
              <input
                type="text"
                className="text-black"
                value={newSavingGoal.name}
                placeholder="Name"
                onChange={(e) =>
                  setNewSavingGoal({ ...newSavingGoal, name: e.target.value })
                }
              />
              <p className="mt-2">Saved:</p>
              <input
                type="number"
                className="text-black"
                value={newSavingGoal.amount}
                onChange={(e) =>
                  setNewSavingGoal({
                    ...newSavingGoal,
                    amount: Number(e.target.value),
                  })
                }
              />
              <p className="mt-2">Target amount:</p>
              <input
                type="number"
                className="text-black"
                value={newSavingGoal.saved}
                onChange={(e) =>
                  setNewSavingGoal({
                    ...newSavingGoal,
                    saved: Number(e.target.value),
                  })
                }
              />
              <p className="mt-2">Start date:</p>
              <input
                type="date"
                className="text-black"
                value={newSavingGoal.startDate}
                onChange={(e) =>
                  setNewSavingGoal({
                    ...newSavingGoal,
                    startDate: e.target.value,
                  })
                }
              />
              <p className="mt-2">End date:</p>
              <input
                type="date"
                className="text-black"
                value={newSavingGoal.endDate}
                onChange={(e) =>
                  setNewSavingGoal({
                    ...newSavingGoal,
                    endDate: e.target.value,
                  })
                }
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
              >
                Add Goal
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
            Add Goal
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
              {savingGaols.map((savingGoal) => (
                <tr key={savingGoal.savingId}>
                  <td className="px-4 py-2">{savingGoal.name}</td>
                  <td className="px-4 py-2">{savingGoal.amount}</td>
                  <td className="px-4 py-2">{savingGoal.saved}</td>
                  <td className="px-4 py-2">
                    {savingGoal.startDate.toString()}
                  </td>
                  <td className="px-4 py-2">{savingGoal.endDate.toString()}</td>
                  <td className="px-4 py-2">
                    <button className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]">
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteSavingGoal(savingGoal.savingId)}
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
    </main>
  );
}
