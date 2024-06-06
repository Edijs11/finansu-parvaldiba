'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import CreateDebtForm from './createDebtForm';
import EditDebtForm from './editDebtForm';
import { precentageCalculation } from '../components/functions';
import Link from 'next/link';
import Frame from '../components/frame';
import DeleteModal from '../components/deleteModal';

interface Debt {
  debtId: number;
  name: string;
  amount: number;
  saved: number;
  interest_rate: number;
  startDate: Date;
  endDate: Date;
  userId: number;
}

export interface CreateDebt {
  name: string;
  amount: number;
  saved: number;
  interest_rate: number;
  startDate: Date;
  endDate: Date;
  userId?: number;
}

const Debt = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [debts, setDebts] = useState<Debt[]>([]);
  const [newDebt, setNewDebt] = useState<Debt>({
    debtId: 1,
    name: '',
    amount: 0,
    saved: 0,
    interest_rate: 0,
    startDate: new Date(),
    endDate: new Date(),
    userId: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const createDebt = async (debt: CreateDebt) => {
    try {
      const response = await axios.post(`${apiUrl}/api/debt`, debt);
      setDebts([response.data, ...debts]);
      setNewDebt({
        debtId: 1,
        name: '',
        amount: 0,
        saved: 0,
        interest_rate: 0,
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
      });
    } catch (error) {
      console.error('Error creating debt:', error);
    }
  };

  const callEditModal = async (id: number) => {
    const current = await axios.get(`${apiUrl}/api/debt/${id}`);
    const formatedStartDate = new Date(current.data.startDate)
      .toISOString()
      .split('T')[0];
    const formatedEndDate = new Date(current.data.endDate)
      .toISOString()
      .split('T')[0];
    setNewDebt({
      ...current.data,
      startDate: formatedStartDate,
      endDate: formatedEndDate,
    });
    setIsEditModalOpen(true);
    return current.data;
  };

  const editDebt = async (id: number, updateDebt: Debt) => {
    try {
      await axios.put(`${apiUrl}/api/debt/${id}`, newDebt);
      setNewDebt({
        debtId: 1,
        name: '',
        amount: 0,
        saved: 0,
        interest_rate: 0,
        startDate: new Date(),
        endDate: new Date(),
        userId: 1,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error editing saving goal:', error);
    }
  };

  const deleteDebt = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/debt/${id}`);
      setDebts(debts.filter((debt) => debt.debtId != id));
    } catch (error) {
      console.error('Error deleting debt:', error);
    }
    setConfirmDelete(false);
  };
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const debtPrecentage = debts.map((debt) => ({
    id: debt.debtId,
    name: debt.name,
    precentage: precentageCalculation(debt.saved, debt.amount).toFixed(0),
  }));

  if (isLoading)
    return (
      <div className="flex flex-col items-center p-6">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125]" />
      </div>
    );
  return isAuthenticated ? (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-ful">
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <CreateDebtForm onCreateDebt={createDebt} />
          </Modal>
        )}
        {isEditModalOpen && (
          <Modal onClose={() => setIsEditModalOpen(false)}>
            <EditDebtForm updateDebt={newDebt} onEditDebt={editDebt} />
          </Modal>
        )}

        {confirmDelete && (
          <DeleteModal
            id={deleteId}
            confirmDelete={deleteDebt}
            onClose={() => setConfirmDelete(false)}
          />
        )}

        {debts.length ? (
          <Frame title="Parādu progress">
            {debtPrecentage.map((debt) => (
              <div className="w-full" key={debt.id}>
                <div className="mt-2">{debt.name}</div>
                <div className="bg-gray-400 rounded-full dark:bg-gray-600 mt-1">
                  <div
                    className="bg-blue-500 text-center rounded-full"
                    style={{ width: `${debt.precentage}%` }}
                  >
                    <div>{debt.precentage}%</div>
                  </div>
                </div>
              </div>
            ))}
          </Frame>
        ) : (
          ''
        )}

        <div className="mt-6 flex flex-col max-w-full">
          <h1 className="text-4xl">Parādi</h1>
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
                <th className="px-4 py-2">Procentu likme</th>
                <th className="px-4 py-2">Sākuma datums</th>
                <th className="px-4 py-2">Beigu datums</th>
                <th className="px-4 py-2">Darbības</th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => (
                <tr key={debt.debtId} className="hover:bg-slate-800">
                  <td className="px-4 py-2">{debt.name}</td>
                  <td className="px-4 py-2">{debt.amount}€</td>
                  <td className="px-4 py-2">{debt.saved}€</td>
                  <td className="px-4 py-2">{debt.interest_rate}%</td>
                  <td className="px-4 py-2">{debt.startDate.toString()}</td>
                  <td className="px-4 py-2">{debt.endDate.toString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => callEditModal(debt.debtId)}
                      className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[75px]"
                    >
                      Rediģēt
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(debt.debtId)}
                      className="bg-red-500 hover:bg-red-600 rounded text-white p-2 w-[70px]"
                    >
                      Dzēst
                    </button>
                  </td>
                  <td>
                    <Link
                      className="px-4"
                      href={{
                        pathname: `/debt/${debt.debtId}/transaction`,
                        query: { debt: JSON.stringify(debt) },
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
export default Debt;
