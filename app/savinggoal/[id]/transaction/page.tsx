'use client';

import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { TransactionType } from '@prisma/client';
import axios from 'axios';
import { usePathname, useSearchParams, redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateTransactionForm from './createTransaction';
import Modal from '../../../components/modal';
import { formatDate } from '@/app/components/functions';
import { useRouter } from 'next/navigation';

interface Transaction {
  transactionId: number;
  amount: number;
  date: Date;
  type: TransactionType;
  savingGoalId: number;
}

const GoalTransaction = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // const router = useRouter();
  // const { replace } = useRouter();
  const searchParams = useSearchParams();
  const savingGoal = searchParams.get('savingGoal') ?? '';
  const goal = savingGoal ? JSON.parse(savingGoal) : null;
  const pathname = usePathname();
  // console.log(searchParams);
  // const newUrl = new URLSearchParams(searchParams.toString());
  // console.log(newUrl.get('saved'));
  const handleSavedChange = (saved: number) => {
    const params = new URLSearchParams(window.location.search);
    // redirect(`${apiUrl}/api/savinggoal/${goal.savingId}/transaction`);
    // params.set('saved', '10000');
    // const newUrl = `${window.location.pathname}?${params.toString()}`;
    // window.history.replaceState(null, '', newUrl);
    // console.log(newUrl);

    // const decodedUrl = decodeURIComponent(params.toString());
    // const dec = new URLSearchParams(decodedUrl);
    // dec.set('saved', (Number(goal.saved) + saved).toString());
    // const encodedUrl = encodeURIComponent(dec.toString());
    // console.log(encodedUrl);

    // const newUrl = `${pathname}?${encodedUrl}`;
    // console.log(newUrl);
    // window.history.replaceState(null, '', newUrl);

    // if (saved) {
    //   const newVal = parseFloat(goal.saved) + saved;
    //   params.set('saved', newVal.toString());
    // }
    // console.log(`${window.location.search}?${params.toString()}`);
    // goal.saved = parseFloat(goal.saved) + saved;
    // redirect(`${pathname}?${params.toString()}`);
  };

  // const handleGoalTransactions = (saved: number) => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   const savedAmount = params.get('saved');
  //   // const newVal = savedAmount ? parseFloat(savedAmount) + saved : savedAmount;

  //   console.log(savedAmount);
  //   // if (!isNaN(newVal)) {
  //   //   params.set('saved', newVal.toString());
  //   // }
  // };

  // console.log(newUrl);
  // const handleNewTransaction = (amount: string) => {
  //   // const params = new URLSearchParams(searchParams);
  //   // const currentAmount = params.get('saved') || 0;
  //   // console.log(currentAmount);
  //   // params.set('amount', amount);
  //   // router.push(`${pathname}?${params.toString()}`);
  //   const currentAmount = searchParams.get('saved');
  //   console.log(currentAmount);
  //   if (currentAmount !== null) {
  //     const newAmount = parseFloat(currentAmount) + amount;

  //     const newUrl = new URLSearchParams(searchParams.toString());
  //     newUrl.set('saved', newAmount);
  //     router.push(`${window.location.pathname}?${newUrl.toString()}`);
  //   }
  // };

  // const path = usePathname();
  // const par = new URLSearchParams(window.location.search);
  // console.log(par);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    transactionId: 1,
    amount: 0,
    date: new Date(),
    type: 'GOAL',
    savingGoalId: 1,
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
          `${apiUrl}/api/savinggoal/${goal.savingId}/transaction`
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
      // const response = await axios.post(
      //   `${apiUrl}/api/transaction`,
      //   transaction
      // );
      const response = await axios.post(
        `${apiUrl}/api/savinggoal/${goal.savingId}/transaction`,
        transaction
      );
      // goal.amount = goal.amount + transaction.amount;
      // const updateUrl = new URLSearchParams(goal);
      // updateUrl.set('amount', JSON.stringify(goal));
      // replace(`${path}?${updateUrl.toString()}`);
      setTransactions([response.data, ...transactions]);
      // handleNewTransaction(response.data.amount);
      handleSavedChange(transaction.amount);
      setNewTransaction({
        transactionId: 1,
        amount: 0,
        date: new Date(),
        type: 'GOAL',
        savingGoalId: 1,
      });
      goal.amount = goal.amount + transaction.amount;
      // const updatedGoal = JSON.stringify(goal);
      // router.push(
      //   {
      //     pathname: `/savinggoal/${goal.savingId}/transaction`,
      //     query: { savingGoal: updatedGoal },
      //   }
      //   // [router, goal]
      // );
      // redirect('');

      //       const router = useRouter();
      // goal.amount + transaction.amount;
      // router.replace({
      //   query: { ...router.query, key: goal.amount },
      // });
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await axios.delete(
        `${apiUrl}/api/savinggoal/${goal.savingId}/transaction/${id}`
      );
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
      {isCreateTransactionModalOpen && (
        <Modal onClose={() => setIsCreateTransactionModalOpen(false)}>
          <CreateTransactionForm onCreateTransaction={createTransaction} />
        </Modal>
      )}

      <div className="flex flex-row space-x-5">
        <table className="mt-2">
          <thead className="border-b border-gray-400">
            <tr className="mb-2">
              <th className="px-4 py-2 ">Nosaukums</th>
              <th className="px-4 py-2">Ietaupītais apjoms</th>
              <th className="px-4 py-2">Kopējais apjoms</th>
              <th className="px-4 py-2">Sākuma datums</th>
              <th className="px-4 py-2">Beigu datums</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">{goal.name}</td>
              <td className="px-4 py-2">{goal.saved}€</td>
              <td className="px-4 py-2">{goal.amount}€</td>
              <td className="px-4 py-2">{goal.startDate}</td>
              <td className="px-4 py-2">{goal.endDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h1 className="mt-8 flex flex-col items-center text-2xl">
          Taupīšanas Mērķa Transakcijas
        </h1>

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
export default GoalTransaction;
