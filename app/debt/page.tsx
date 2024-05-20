'use client';

import { incomeType, User } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../components/modal';
import { number } from 'zod';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import CreateDebtForm from './createDebtForm';
import EditDebtForm from './editDebtForm';
// import UserComponent from './components/IncomeComponent';

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
  // const [updateDebt, setUpdateDebt] = useState({
  //   name: '',
  // });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debtId, setDebtId] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleEdit = (id: number) => {
    setIsEditModalOpen(true);
    setDebtId(id);
  };

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

  const createDebt = async (debt: Debt) => {
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

  const deleteDebt = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/debt/${id}`);
      setDebts(debts.filter((debt) => debt.debtId != id));
    } catch (error) {
      console.error('Error deleting debt:', error);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center p-6">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125]" />
      </div>
    );
  return isAuthenticated ? (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CreateDebtForm onCreateDebt={createDebt} />
        </Modal>
      )}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <EditDebtForm id={debtId} />
        </Modal>
      )}

      <div className="mt-6 flex flex-col max-w-full">
        <button
          className="p-2 bg-green-500 hover:bg-green-600 rounded text-white mt-6 w-[100px] place-self-end"
          onClick={() => setIsModalOpen(true)}
        >
          Add Debt
        </button>
        <table>
          <thead>
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
            {formatedDebts.map((debt) => (
              <tr key={debt.debtId} className="hover:bg-slate-800">
                <td className="px-4 py-2">{debt.name}</td>
                <td className="px-4 py-2">{debt.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{debt.saved.toFixed(2)}</td>
                <td className="px-4 py-2">{debt.interest_rate}%</td>
                <td className="px-4 py-2">{debt.startDate.toString()}</td>
                <td className="px-4 py-2">{debt.endDate.toString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(debt.debtId)}
                    className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]"
                  >
                    Rediģēt
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => deleteDebt(debt.debtId)}
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
    <div className="flex flex-col items-center justify-between">
      <h1 className="mt-6">You must be logged in!</h1>
      <LoginLink className="mt-4">Login</LoginLink>
    </div>
  );
};
export default Debt;
