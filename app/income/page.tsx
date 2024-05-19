'use client';

import { incomeType } from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import axios from 'axios';
import Frame from '../components/frame';
import Modal from '../components/modal';
import DeleteModal from '../components/deleteModal';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import CreateIncomeForm from './createIncomeForm';
import EditIncomeForm from './editIncomeForm';

export interface Income {
  incomeId: number;
  name: string;
  amount: number;
  date: Date;
  userId: number;
  type: incomeType;
}

// export interface IncomeProps {
//   name: string;
//   amount: number;
//   date: Date;
//   type: incomeType;
// }

const Income = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [incomeId, setIncomeId] = useState(0);
  const [delId, setDelId] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const incomeTypeColors: { [key in incomeType]: string } = {
    [incomeType.SALARY]: '#96FF33',
    [incomeType.DIVIDENDS]: '#FF5735',
    [incomeType.GOVERMENT_ASSISTANCE]: '#1E7000',
    [incomeType.GIFT]: '#96FF33',
    [incomeType.REALASTATE]: '#8884d9',
    [incomeType.PROFIT_INCOME]: '#8A5A31',
    [incomeType.INTEREST_INCOME]: '#008DA9',
    [incomeType.ROYALTY_INCOME]: '#FFA500',
    [incomeType.OTHER]: '#D3D3D3',
  };
  incomes.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // const today = new Date();
  // const from = new Date();
  // from.setDate(today.getDate() - 30);

  const handleEdit = (id: number) => {
    setIsEditModalOpen(true);
    setIncomeId(id);
  };

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/income`);
        setIncomes(response.data);
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

  const formatedIncomes = useMemo(() => {
    return incomes.map((income) => ({
      ...income,
      date: formatDate(income.date),
    }));
  }, [incomes]);

  const filterIncome = () => {
    if (startDate && endDate) {
      const filteredIncomes = incomes.filter(
        (income) =>
          new Date(income.date).getTime() >= new Date(startDate).getTime() &&
          new Date(income.date).getTime() <= new Date(endDate).getTime()
      );
      console.log(filteredIncomes);
      setIncomes(filteredIncomes);
    }
  };

  // const handleResetDateFilter = () => {
  //   setStartDate('');
  //   setEndDate('');
  // };

  const incomeTypeAndCount: { type: incomeType; amount: number }[] = [];

  incomes.forEach((income) => {
    const existingType = incomeTypeAndCount.findIndex(
      (item) => item.type === income.type
    );
    if (existingType !== -1) {
      incomeTypeAndCount[existingType].amount += income.amount;
    } else {
      incomeTypeAndCount.push({ type: income.type, amount: income.amount });
    }
  });

  // const addIncome = (newIncome: Income) => {
  //   setIncomes([...incomes, newIncome]);
  // };

  const createIncome = async (income: Income) => {
    try {
      const response = await axios.post(`${apiUrl}/api/income`, income);
      setIncomes([response.data, ...incomes]);
      setNewIncome({
        incomeId: 1,
        name: '',
        amount: 0,
        date: new Date(),
        type: incomeType.SALARY,
        userId: 1,
      });
    } catch (error) {
      console.error('Error creating income:', error);
    }
  };

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
    setConfirmDelete(false);
  };

  const handleDelete = (id: number) => {
    setDelId(id);
    setConfirmDelete(true);
  };

  var tooltip: string;
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !tooltip) return null;
    for (const bar of payload) {
      if (bar.dataKey === tooltip) {
        return (
          <div className="bg-slate-600 p-4">
            <p>{payload[0].payload.date}</p>
            <p>{payload[0].payload.name}</p>
            <p>{`${payload[0].payload.type}: ${payload[0].value.toFixed(
              2
            )}`}</p>
          </div>
        );
      }
    }
  };

  let height;
  let width;
  if (incomes.length >= 20) {
    height = 400;
    width = 1000;
  } else {
    height = 300;
    width = 500;
  }

  if (isLoading)
    return (
      <div className="flex flex-col items-center p-6">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125]" />
      </div>
    );
  return isAuthenticated ? (
    <div className="flex flex-col items-center justify-between">
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <EditIncomeForm id={incomeId} />
        </Modal>
      )}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateIncomeForm onCreateIncome={createIncome} />
          {/* onCreateIncome={createIncome} */}
        </Modal>
      )}

      {confirmDelete && (
        <DeleteModal
          id={delId}
          confirmDelete={deleteIncome}
          onClose={() => setConfirmDelete(false)}
        />
      )}
      {incomes.length ? (
        <div className="mt-6 px-2 max-w-full">
          <Frame title="Incomes">
            <BarChart width={width} height={height} data={[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                data={formatedIncomes}
                onMouseOver={() => (tooltip = 'amount')}
              >
                {formatedIncomes.map((income, index) => (
                  <Cell key={index} fill={incomeTypeColors[income.type]} />
                ))}
              </Bar>
            </BarChart>
          </Frame>
        </div>
      ) : (
        ''
      )}
      {incomeTypeAndCount.length > 1 ? (
        <div className="mt-6">
          <Frame title="Types">
            <PieChart width={500} height={400} className="-mt-6">
              <Legend />
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={incomeTypeAndCount}
                dataKey="amount"
                nameKey="type"
                // cx="50%"
                // cy="50%"
                // outerRadius={100}
                fill="#8884d8"
                onMouseOver={() => (tooltip = 'amount')}
              >
                {incomeTypeAndCount.map((income, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={incomeTypeColors[income.type]}
                  />
                ))}
              </Pie>
            </PieChart>
          </Frame>
        </div>
      ) : (
        ''
      )}
      <div className="mt-6 flex flex-col max-w-full">
        <button
          className="p-2 bg-green-500 hover:bg-green-600 rounded text-white w-[120px] place-self-end"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add income
        </button>
        {/* <div className="flex justify-between place-self-end mt-2">
          <div className="mt-2">
            From:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mx-2 text-black rounded-sm"
            />
            To:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mx-2 text-black rounded-sm"
            />
            <button
              onClick={filterIncome}
              className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]"
            >
              Filter
            </button>
            <button
              onClick={handleResetDateFilter}
              className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[100px]"
            >
              Reset filter
            </button>
          </div>
        </div> */}

        <table className="mt-2">
          <thead className="border-b border-gray-400">
            <tr className="mb-2">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {formatedIncomes.toReversed().map((income) => (
              <tr key={income.incomeId} className="hover:bg-slate-800">
                <td className="px-4 py-2">{income.name}</td>
                <td className="px-4 py-2">{income.amount}</td>
                <td className="px-4 py-2">{income.type}</td>
                <td className="px-4 py-2">{income.date}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(income.incomeId)}
                    className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[70px]"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(income.incomeId)}
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
      <div></div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-between">
      <h1 className="mt-6">You must be logged in!</h1>
      <LoginLink className="mt-4">Login</LoginLink>
    </div>
  );
};
export default Income;
