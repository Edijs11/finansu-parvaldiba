'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import CreateSavingGoalForm from './createSavingGoalForm';
import Link from 'next/link';
import Frame from '../components/frame';
import EditSavingGoalForm from './editSavingGoalForm';
import { precentageCalculation } from '../components/functions';
import DeleteModal from '../components/deleteModal';

interface SavingGoal {
  savingId: number;
  name: string;
  amount: number;
  saved: number;
  startDate: Date;
  endDate: Date;
  userId: number;
}

export interface CreateSavingGoal {
  name: string;
  amount: number;
  saved: number;
  startDate: Date;
  endDate: Date;
  userId?: number;
}

const SavingGoal = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [savingGaols, setSavingGoals] = useState<SavingGoal[]>([]);
  const [savingGoalAction, setSavingGoalAction] = useState<SavingGoal>({
    savingId: 1,
    name: '',
    amount: 0,
    saved: 0,
    startDate: new Date(),
    endDate: new Date(),
    userId: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchSavingGoals = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/savinggoal`);
        setSavingGoals(response.data);
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchSavingGoals();
  }, [savingGoalAction]);

  const createSavingGoal = async (savingGoal: CreateSavingGoal) => {
    try {
      const response = await axios.post(`${apiUrl}/api/savinggoal`, savingGoal);
      setSavingGoals([response.data, ...savingGaols]);
      setSavingGoalAction({
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

  const callEditModal = async (id: number) => {
    const current = await axios.get(`${apiUrl}/api/savinggoal/${id}`);
    const formatedStartDate = new Date(current.data.startDate)
      .toISOString()
      .split('T')[0];
    const formatedEndDate = new Date(current.data.endDate)
      .toISOString()
      .split('T')[0];
    setSavingGoalAction({
      ...current.data,
      startDate: formatedStartDate,
      endDate: formatedEndDate,
    });
    setIsEditModalOpen(true);
    return current.data;
  };

  const editSavingGoal = async (id: number, updateGoal: SavingGoal) => {
    try {
      await axios.put(`${apiUrl}/api/savinggoal/${id}`, updateGoal);
      setSavingGoalAction({
        savingId: 1,
        name: '',
        amount: 0,
        saved: 0,
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error editing saving goal:', error);
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
    setConfirmDelete(false);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const goalPrecentage = savingGaols.map((savingGoal) => ({
    id: savingGoal.savingId,
    name: savingGoal.name,
    precentage: precentageCalculation(
      savingGoal.saved,
      savingGoal.amount
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
            <EditSavingGoalForm
              savingGoalAction={savingGoalAction}
              onEditSavingGoal={editSavingGoal}
            />
          </Modal>
        )}

        {confirmDelete && (
          <DeleteModal
            id={deleteId}
            confirmDelete={deleteSavingGoal}
            onClose={() => setConfirmDelete(false)}
          />
        )}

        {savingGaols.length ? (
          <Frame title="Taupīšanas mērķu progress">
            {goalPrecentage.map((goal) => (
              <div className="w-full" key={goal.id}>
                <div className="mt-2">{goal.name}</div>
                <div className="bg-gray-400 rounded-full mt-1">
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
        ) : (
          ''
        )}
        <div className="mt-6 flex flex-col max-w-full">
          <h1 className="text-4xl">Taupīšanas mērķi</h1>
          <button
            className="p-2 bg-green-500 hover:bg-green-600 rounded text-white mt-6 w-[100px] place-self-end"
            onClick={() => setIsModalOpen(true)}
          >
            Pievienot
          </button>
          <table>
            <thead className="border-b border-gray-400">
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
              {savingGaols.map((savingGoal) => (
                <tr key={savingGoal.savingId} className="hover:bg-slate-800">
                  <td className="px-4 py-2">{savingGoal.name}</td>

                  <td className="px-4 py-2">{savingGoal.saved}€</td>
                  <td className="px-4 py-2">{savingGoal.amount}€</td>
                  <td className="px-4 py-2">
                    {savingGoal.startDate.toString()}
                  </td>
                  <td className="px-4 py-2">{savingGoal.endDate.toString()}</td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => callEditModal(savingGoal.savingId)}
                      className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]"
                    >
                      Rediģēt
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(savingGoal.savingId)}
                      className="bg-red-500 hover:bg-red-600 rounded text-white p-2 w-[75px]"
                    >
                      Dzēst
                    </button>
                  </td>
                  <td>
                    <Link
                      className="px-4"
                      href={{
                        pathname: `/savinggoal/${savingGoal.savingId}/transaction`,
                        query: { savingGoal: JSON.stringify(savingGoal) },
                      }}
                    >
                      <button className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[85px]">
                        Apmeklēt
                      </button>
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
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center ">
        <h1>Jums nepieciešams pieslēgties, lai piekļūtu šai lapai!</h1>
        <LoginLink className="mt-4">Pieslēgties</LoginLink>
      </div>
    </div>
  );
};
export default SavingGoal;
