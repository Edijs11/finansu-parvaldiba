'use client';

import { User } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import CreateSavingGoalForm from './createSavingGoalForm';
// import UserComponent from './components/IncomeComponent';

interface SavingGoal {
  savingId: number;
  name: string;
  amount: number;
  saved: number;
  startDate: Date;
  endDate: Date;
  userId: number;
}

export default function SavingGoal() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = 'http://localhost:3000';
  const [savingGaols, setSavingGoals] = useState<SavingGoal[]>([]);
  const [newSavingGoal, setNewSavingGoal] = useState<SavingGoal>({
    savingId: 1,
    name: '',
    amount: 0,
    saved: 0,
    startDate: new Date(),
    endDate: new Date(),
    userId: 1,
  });
  const [updateSavingGoal, setUpdateSavingGoal] = useState<SavingGoal>({
    savingId: 1,
    name: '',
    amount: 0,
    saved: 0,
    startDate: new Date(),
    endDate: new Date(),
    userId: 1,
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

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  const formatedSavingGoals = savingGaols.map((savingGaol) => ({
    ...savingGaol,
    startDate: formatDate(savingGaol.startDate),
    endDate: formatDate(savingGaol.endDate),
  }));

  const createSavingGoal = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/savinggoal`,
        newSavingGoal
      );
      setSavingGoals([response.data, ...savingGaols]);
      setNewSavingGoal({
        savingId: 1,
        name: '',
        amount: 0,
        saved: 0,
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
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

  if (isLoading) return <div>Loading..</div>;
  return isAuthenticated ? (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="overflow-x-auto">
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <CreateSavingGoalForm />
            {/* <form onSubmit={createSavingGoal} className="flex flex-col mt-2 ">
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
                value={newSavingGoal.startDate.toISOString().split('T')[0]}
                onChange={(e) =>
                  setNewSavingGoal({
                    ...newSavingGoal,
                    startDate: new Date(e.target.value),
                  })
                }
              />
              <p className="mt-2">End date:</p>
              <input
                type="date"
                className="text-black"
                value={newSavingGoal.endDate.toISOString().split('T')[0]}
                onChange={(e) =>
                  setNewSavingGoal({
                    ...newSavingGoal,
                    endDate: new Date(e.target.value),
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
            </form> */}
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
              {formatedSavingGoals.map((savingGoal) => (
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
  ) : (
    <div className="flex flex-col items-center justify-between">
      <h1 className="mt-6">You must be logged in!</h1>
      <LoginLink className="mt-4">Login</LoginLink>
    </div>
  );
}
