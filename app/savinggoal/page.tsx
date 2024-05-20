'use client';

import { User } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import CreateSavingGoalForm from './createSavingGoalForm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import Frame from '../components/frame';
import EditSavingGoalForm from './editSavingGoalForm';
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

const SavingGoal = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
  const [savingGoalId, setSavingGoalId] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  // const onTableNavigation = (goal: SavingGoal) => {
  //   redirect(`/savinggoal/${goal.savingId}/transaction`);
  // };
  const handleEdit = (id: number) => {
    setIsEditModalOpen(true);
    setSavingGoalId(id);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  // const progressPrecentage: {[key: string]: number} = {}
  // ((savingGaol.saved - savingGaol.amount) / savingGaol.amount) * 100
  {
    /* {savingGaols.map((savingGoal) => (
          <div>
            {savingGoal.name}
            <div className="bg-gray-200 rounded-full dark:bg-slate-500">
              <div className="bg-blue-400 text-center rounded-full">10</div>
            </div>
          </div>
        ))} */
  }

  const formatedSavingGoals = savingGaols.map((savingGaol) => ({
    ...savingGaol,
    startDate: formatDate(savingGaol.startDate),
    endDate: formatDate(savingGaol.endDate),
  }));

  const createSavingGoal = async (savingGoal: SavingGoal) => {
    try {
      const response = await axios.post(`${apiUrl}/api/savinggoal`, savingGoal);
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

  const savingGoalPrecentageCalculation = (
    saved: number,
    total: number
  ): number => {
    return (saved / total) * 100;
  };

  const goalPrecentage = savingGaols.map((savingGoal) => ({
    name: savingGoal.name,
    precentage: savingGoalPrecentageCalculation(
      savingGoal.amount,
      savingGoal.saved
    ).toFixed(0),
  }));

  if (isLoading)
    return (
      <div className="flex flex-col items-center p-6">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125]" />
      </div>
    );
  return isAuthenticated ? (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-full">
      <div className="max-w-full">
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <CreateSavingGoalForm onCreateSavingGoal={createSavingGoal} />
          </Modal>
        )}
        {isEditModalOpen && (
          <Modal onClose={() => setIsEditModalOpen(false)}>
            <EditSavingGoalForm id={savingGoalId} />
          </Modal>
        )}
        <Frame title="Taupīšanas mērķu progress">
          {goalPrecentage.map((goal, index) => (
            <div className="w-full" key={index}>
              <div className="mt-2">{goal.name}</div>
              <div className="bg-gray-400 rounded-full dark:bg-gray-600">
                <div
                  className="bg-blue-500 text-center rounded-full"
                  style={{ width: `${goal.precentage}%` }}
                >
                  <div>{goal.precentage}%</div>
                </div>
              </div>
            </div>
          ))}
        </Frame>

        <div className="mt-6 flex flex-col max-w-full">
          <button
            className="p-2 bg-green-500 hover:bg-green-600 rounded text-white mt-6 w-[100px] place-self-end"
            onClick={() => setIsModalOpen(true)}
          >
            Pievienot
          </button>
          <table>
            <thead>
              <tr>
                <th className="px-4 py-2 ">Nosaukums</th>
                <th className="px-4 py-2">Ietaupītais apjoms</th>
                <th className="px-4 py-2">Kopējais apjoms</th>
                <th className="px-4 py-2">Sākuma datums</th>
                <th className="px-4 py-2">Beigu datums</th>
                <th className="px-4 py-2">Darbības</th>
              </tr>
            </thead>
            <tbody>
              {formatedSavingGoals.map((savingGoal) => (
                <tr key={savingGoal.savingId} className="hover:bg-slate-800">
                  <td className="px-4 py-2">{savingGoal.name}</td>

                  <td className="px-4 py-2">{savingGoal.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{savingGoal.saved.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {savingGoal.startDate.toString()}
                  </td>
                  <td className="px-4 py-2">{savingGoal.endDate.toString()}</td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(savingGoal.savingId)}
                      className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]"
                    >
                      Rediģēt
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteSavingGoal(savingGoal.savingId)}
                      className="bg-red-500 hover:bg-red-600 rounded text-white p-2 w-[70px]"
                    >
                      Dzēst
                    </button>
                    <Link
                      className="px-4"
                      href={{
                        pathname: `/savinggoal/${savingGoal.savingId}/transaction`,
                        query: { savingGoal: JSON.stringify(savingGoal) },
                      }}
                    >
                      :
                    </Link>
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
};
export default SavingGoal;
