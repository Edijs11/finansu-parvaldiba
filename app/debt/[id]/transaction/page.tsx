'use client';

import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { TransactionType } from '@prisma/client';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '../../../components/modal';
import { formatDate } from '@/app/components/functions';
import CreateTransactionForm from './createTransaction';

interface Transaction {
  transactionId: number;
  amount: number;
  date: Date;
  type: TransactionType;
  debtId: number;
}

const DebtTransaction = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const currentDebt = searchParams.get('debt') ?? '';
  const debt = currentDebt ? JSON.parse(currentDebt) : null;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    transactionId: 1,
    amount: 0,
    date: new Date(),
    type: 'DEBT',
    debtId: 1,
  });
  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
    useState(false);

  transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/debt/${debt.debtId}/transaction`
        );
        setTransactions(response.data);
      } catch (error) {
        console.error('error getting transactions: ', error);
      }
    };
    getTransactions();
  }, [newTransaction]);

  const createTransaction = async (transaction: Transaction) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/debt/${debt.debtId}/transaction`,
        transaction
      );

      setTransactions([response.data, ...transactions]);
      setNewTransaction({
        transactionId: 1,
        amount: 0,
        date: new Date(),
        type: 'GOAL',
        debtId: 1,
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/debt/${debt.debtId}/transaction/${id}`);
      setTransactions(
        transactions.filter((transaction) => transaction.transactionId != id)
      );
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center p-6">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125]" />
      </div>
    );
  return isAuthenticated ? (
    <div className="flex flex-col items-center justify-between p-12">
      <div className="flex flex-row space-x-5">
        <table className="mt-2">
          <thead className="border-b border-gray-400">
            <tr className="mb-2">
              <th className="px-4 py-2 ">Nosaukums</th>
              <th className="px-4 py-2">Ietaupītais apjoms</th>
              <th className="px-4 py-2">Kopējais apjoms</th>
              <th className="px-4 py-2">Procentu likme</th>
              <th className="px-4 py-2">Sākuma datums</th>
              <th className="px-4 py-2">Beigu datums</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">{debt.name}</td>
              <td className="px-4 py-2">{debt.amount}€</td>
              <td className="px-4 py-2">{debt.saved}€</td>
              <td className="px-4 py-2">{debt.interest_rate}%</td>
              <td className="px-4 py-2">{debt.startDate}</td>
              <td className="px-4 py-2">{debt.endDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h1 className="mt-8 flex flex-col items-center text-2xl">
          Parāda Transakcijas
        </h1>
        {isCreateTransactionModalOpen && (
          <Modal onClose={() => setIsCreateTransactionModalOpen(false)}>
            <CreateTransactionForm onCreateTransaction={createTransaction} />
          </Modal>
        )}
        <div className="flex flex-col">
          <button
            className="p-2 bg-green-500 hover:bg-green-600 rounded text-white mt-6 w-[100px] place-self-end"
            onClick={() => setIsCreateTransactionModalOpen(true)}
          >
            Pievienot
          </button>
        </div>
        <table className="mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 ">Transakcijas apjoms</th>
              <th className="px-4 py-2 ">Datums</th>
              <th>Darbības</th>
            </tr>
          </thead>
          <tbody>
            {transactions.toReversed().map((transaction) => (
              <tr key={transaction.transactionId}>
                <td className="px-4 py-2">{transaction.amount}€</td>
                <td className="px-4 py-2">{formatDate(transaction.date)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => console.log('hi')}
                    className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]"
                  >
                    Rediģēt
                  </button>

                  <button
                    onClick={() => deleteTransaction(transaction.transactionId)}
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
export default DebtTransaction;
