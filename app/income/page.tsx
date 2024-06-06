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
import { formatDate } from '../components/functions';

export interface Income {
  incomeId: number;
  name: string;
  amount: number;
  date: Date;
  userId: number;
  type: incomeType;
}

export interface CreateIncome {
  name: string;
  amount: number;
  date: Date;
  type: incomeType;
  userId?: number;
}

const Income = () => {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [newIncome, setNewIncome] = useState<Income>({
    incomeId: 1,
    name: '',
    amount: 0,
    date: new Date(),
    type: 'ALGA',
    userId: 1,
  });
  const [updateIncome, setUpdateIncome] = useState<Income>({
    incomeId: 1,
    name: '',
    amount: 0,
    date: new Date(),
    type: 'ALGA',
    userId: 1,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [delId, setDelId] = useState<number>(0);
  const getCurrentMonth = () => {
    let now = new Date();
    now.setDate(1);
    const currentMonthFirstDate = now.toISOString().split('T')[0];
    return currentMonthFirstDate;
  };
  const [startDate, setStartDate] = useState(getCurrentMonth);
  const getLastDayOfMonth = () => {
    const now = new Date();
    let configureMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    configureMonth.setDate(configureMonth.getDate());
    let lastDayOfM = configureMonth.toISOString().split('T')[0];
    return lastDayOfM;
  };
  const [endDate, setEndDate] = useState(getLastDayOfMonth);

  const incomeTypeColors: { [key in incomeType]: string } = {
    [incomeType.ALGA]: '#96FF33',
    [incomeType.DIVIDENDES]: '#FFFF00',
    [incomeType.DAVANA]: '#FF5735',
    [incomeType.VALSTS_PABALSTS]: '#008DA9',
    [incomeType.NEKUSTAMAIS_IPASUMS]: '#FFA500',
    [incomeType.PELNA]: '#1E7000',
    [incomeType.HONORARS]: '#8884d9',
    [incomeType.CITS]: '#D3D3D3',
  };

  incomes.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/income`);
        setIncomes(response.data);
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchIncomes();
  }, [newIncome]);

  const formatedIncomes = useMemo(() => {
    return incomes
      .filter((income) => {
        return (
          new Date(income.date).getTime() >= new Date(startDate).getTime() &&
          new Date(income.date).getTime() <= new Date(endDate).getTime()
        );
      })
      .map((income) => ({
        ...income,
        date: formatDate(income.date),
      }));
  }, [incomes, startDate, endDate]);

  const removeDateFilter = () => {
    const currentYear = new Date().getFullYear();
    setStartDate(new Date(currentYear, 0, 1 + 1).toISOString().split('T')[0]);
    setEndDate(new Date(currentYear, 11, 31 + 1).toISOString().split('T')[0]);
  };

  const incomeTypeAndCount: { id: number; type: incomeType; amount: number }[] =
    [];

  let incomeTotalAmountId = 1;
  formatedIncomes.forEach((income) => {
    const existingType = incomeTypeAndCount.findIndex(
      (item) => item.type === income.type
    );
    if (existingType !== -1) {
      incomeTypeAndCount[existingType].amount += income.amount;
    } else {
      incomeTypeAndCount.push({
        id: incomeTotalAmountId++,
        type: income.type,
        amount: income.amount,
      });
    }
  });

  const createIncome = async (income: CreateIncome) => {
    try {
      const response = await axios.post(`${apiUrl}/api/income`, income);
      setIncomes([response.data, ...incomes]);
      setNewIncome({
        incomeId: 1,
        name: '',
        amount: 0,
        date: new Date(),
        type: 'ALGA',
        userId: 1,
      });
    } catch (error) {
      console.error('Error creating income:', error);
    }
  };

  const callEditModal = async (id: number) => {
    const current = await axios.get(`${apiUrl}/api/income/${id}`);
    const formatedDate = new Date(current.data.date)
      .toISOString()
      .split('T')[0];
    setUpdateIncome({ ...current.data, date: formatedDate });
    setIsEditModalOpen(true);
    return current.data;
  };

  const editIncome = async (id: number, updateIncome: Income) => {
    try {
      await axios.put(`${apiUrl}/api/income/${id}`, updateIncome);
      setNewIncome({
        incomeId: 1,
        name: '',
        amount: 0,
        date: new Date(),
        type: 'ALGA',
        userId: 1,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error editing income:', error);
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

  let tooltip: string;
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
            )}€`}</p>
          </div>
        );
      }
    }
  };

  let height: number;
  let width: number;
  if (incomes.length < 10) {
    height = 300;
    width = 500;
  } else if (incomes.length < 20) {
    height = 300;
    width = 800;
  } else {
    height = 400;
    width = 1200;
  }

  if (isLoading)
    return (
      <div className="flex flex-col items-center p-6">
        <div className="inline-block w-8 h-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125]" />
      </div>
    );
  return isAuthenticated ? (
    <div className="flex flex-col items-center justify-between">
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateIncomeForm onCreateIncome={createIncome} />
        </Modal>
      )}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <EditIncomeForm
            updateIncome={updateIncome}
            onEditIncome={editIncome}
          />
        </Modal>
      )}

      {confirmDelete && (
        <DeleteModal
          id={delId}
          confirmDelete={deleteIncome}
          onClose={() => setConfirmDelete(false)}
        />
      )}
      {formatedIncomes.length ? (
        <div className="mt-6 px-2 max-w-full">
          <Frame title="Ienākumi">
            <BarChart width={width} height={height} data={formatedIncomes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" onMouseOver={() => (tooltip = 'amount')}>
                {formatedIncomes.map((income) => (
                  <Cell
                    key={income.incomeId}
                    fill={incomeTypeColors[income.type]}
                  />
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
          <Frame title="Tipu sadalījums pret summu">
            <PieChart width={500} height={400} className="-mt-6">
              <Legend />
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={incomeTypeAndCount}
                dataKey="amount"
                nameKey="type"
                fill="#8884d8"
                onMouseOver={() => (tooltip = 'amount')}
              >
                {incomeTypeAndCount.map((income) => (
                  <Cell
                    key={`cell-${income.id}`}
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
        <h1 className="text-4xl">Ienākumi</h1>
        <button
          className="p-2 bg-green-500 hover:bg-green-600 rounded text-white w-[120px] place-self-end"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Pievienot
        </button>
        <div className="flex justify-between place-self-end mt-2">
          <div className="mt-2">
            Diapazons:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mx-2 text-black rounded-sm"
            />
            -
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mx-2 text-black rounded-sm"
            />
            {startDate !== '' ? (
              <button
                onClick={removeDateFilter}
                className="ml-2 text-xl border w-[80px] rounded"
              >
                x
              </button>
            ) : (
              ''
            )}
          </div>
        </div>

        <table className="mt-2">
          <thead className="border-b border-gray-400">
            <tr className="mb-2">
              <th className="px-4 py-2">Nosaukums</th>
              <th className="px-4 py-2">Apjoms</th>
              <th className="px-4 py-2">Tips</th>
              <th className="px-4 py-2">Datums</th>
              <th className="px-4 py-2">Darbības</th>
            </tr>
          </thead>
          <tbody>
            {formatedIncomes.toReversed().map((income) => (
              <tr key={income.incomeId} className="hover:bg-slate-800">
                <td className="px-4 py-2">{income.name}</td>
                <td className="px-4 py-2">{income.amount}€</td>
                <td className="px-4 py-2">{income.type}</td>
                <td className="px-4 py-2">{income.date}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => callEditModal(income.incomeId)}
                    className="bg-orange-300 hover:bg-orange-400 rounded text-white p-2 w-[75px]"
                  >
                    Rediģēt
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(income.incomeId)}
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
      <div></div>
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
export default Income;
