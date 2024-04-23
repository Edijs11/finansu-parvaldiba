'use client';

import { incomeType, User } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { redirect } from 'next/navigation';
import axios from 'axios';
import Frame from '../components/frame';
import Modal from '../components/modal';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import IncomeForm from './createIncomeForm';
import CreateIncomeForm from './createIncomeForm';
import EditIncomeForm from './editIncomeForm';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';

interface Income {
  incomeId: number;
  name: string;
  amount: number;
  date: Date;
  userId: number;
  type: incomeType;
}

export default function Income() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const apiUrl = 'http://localhost:3000';
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [newIncome, setNewIncome] = useState<Income>({
    incomeId: 1,
    name: '',
    amount: 0,
    date: new Date(),
    type: 'SALARY',
    userId: 1,
  });
  const [updateIncome, setUpdateIncome] = useState<Income>({
    incomeId: 1,
    name: '',
    amount: 0,
    date: new Date(),
    type: 'SALARY',
    userId: 1,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // const handleEditClick = (id) => {
  //   setIsCreateModalOpen(true);
  //   return (
  //     <Modal onClose={() => setIsCreateModalOpen(false)}>
  //       <EditIncomeForm id={id} />
  //     </Modal>
  //   );
  // };

  // const handleSubmit = (event: any) => {
  //   event.preventDefault();
  //   const formData = {
  //     name: event.target.name.value,
  //     amount: event.target.amount.value,
  //     date: event.target.date.value,
  //     type: event.target.type.value,
  //   };

  //   try {
  //     incomeShema.parse(formData);
  //     console.log('valid');
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/income`);
        setIncomes(response.data.reverse());
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchIncome();
  }, [newIncome]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  const formatedIncome = incomes.map((income) => ({
    ...income,
    date: formatDate(income.date),
  }));

  // const createIncome = async () => {
  //   try {
  //     const response = await axios.post(`${apiUrl}/api/income`, newIncome);
  //     setIncomes([response.data, ...incomes]);
  //     setNewIncome({
  //       incomeId: 1,
  //       name: '',
  //       amount: 0,
  //       date: new Date(),
  //       type: incomeType.SALARY,
  //       userId: 1,
  //     });
  //   } catch (error) {
  //     console.error('Error creating income:', error);
  //   }
  // };

  const editIncome = async (id: number) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/income/${id}`,
        updateIncome
      );
      setIncomes(response.data);
      setUpdateIncome(response.data);
      // const updateSpecific = incomes.map(
      //   (income) => (income.incomeId = id ? response.data : income)
      // );
      console.log(response.data);
      // return response.data;

      // setIncomes([response.data, ...incomes]);
      // updateIncome({ name: '', amount: 0, date: '', type: incomeType.SALARY });
    } catch (error) {
      console.error('Error creating income:', error);
    }
  };

  const deleteIncome = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/income/${id}`);
      setIncomes(incomes.filter((income) => income.incomeId != id));
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  // content={<CustomTooltip />}
  // const CustomTooltip = ({ payload }) => {
  //   if (payload && payload.label) {
  //     return (
  //       <div>
  //         <p className="label">{`${label}: ${payload[0].value}`}</p>
  //         <p>
  //           income:
  //           <span>{payload[0].value}</span>
  //         </p>
  //       </div>
  //     );
  //   }
  // };

  if (isLoading) return <div className="animate-spin w-5 h-5" />;
  return isAuthenticated ? (
    <div className="flex flex-col items-center justify-between">
      {/* <h1>Add Income</h1>
          <form onSubmit={createIncome} className="flex flex-col mt-2">
            <p>Name:</p>
            <input
              type="text"
              className="text-black"
              value={newIncome.name}
              onChange={(e) =>
                setNewIncome({ ...newIncome, name: e.target.value })
              }
            />
            <p className="mt-2">Amount:</p>
            <input
              type="number"
              className="text-black"
              value={newIncome.amount}
              onChange={(e) =>
                setNewIncome({ ...newIncome, amount: Number(e.target.value) })
              }
            />
            <p className="mt-2">Date:</p>
            <input
              type="date"
              className="text-black"
              value={newIncome.date.toISOString().split('T')[0]}
              onChange={(e) =>
                setNewIncome({
                  ...newIncome,
                  date: new Date(e.target.value),
                })
              }
            />
            <p className="mt-2">Type:</p>
            <select
              className="text-black"
              onChange={(e) =>
                setNewIncome({
                  ...newIncome,
                  type: e.target.value as incomeType,
                })
              }
            >
              {Object.values(incomeType).map((selectedType, index) => (
                <option key={index} value={selectedType}>
                  {selectedType}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white mt-6"
            >
              Add Income
            </button>
            <button onClick={() => setIsCreateModalOpen(true)}></button>
          </form> */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateIncomeForm />
        </Modal>
      )}
      <div className="mt-6">
        <Frame title="Income">
          <BarChart
            width={400}
            height={250}
            data={formatedIncome}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar type="monotone" dataKey="amount" fill="#FF7F7F" />
          </BarChart>
        </Frame>
      </div>

      <div className="mt-6 flex flex-col">
        <button
          className="p-2 bg-green-500 hover:bg-green-600 rounded text-white mt-6 w-[120px] place-self-end"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add income
        </button>
        <table>
          <thead className="border-b border-gray-400">
            <tr className="mb-2">
              <th className="px-4 py-2 ">Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {formatedIncome.map((income) => (
              <tr key={income.incomeId}>
                <td className="px-4 py-2">{income.name}</td>
                <td className="px-4 py-2">{income.amount}</td>
                <td className="px-4 py-2">{income.type}</td>
                <td className="px-4 py-2">{income.date}</td>
                <td className="px-4 py-2">
                  <button
                    // onClick={() => handleEdit(income.incomeId)}
                    className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => deleteIncome(income.incomeId)}
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
