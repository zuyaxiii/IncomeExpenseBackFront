import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TransactionForm from "./Transaction.js";

const API_URL = 'http://localhost:4000';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchType, setSearchType] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [summary, setSummary] = useState({});
  const [error, setError] = useState('');

  const token = localStorage.getItem("token");

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลรายการ');
    }
  }, [token]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลสรุป');
    }
  }, [token]);

  const filterTransactions = useCallback(() => {
    let filtered = transactions;

    if (searchType) {
      filtered = filtered.filter((t) => t.type === searchType);
    }

    if (searchDate) {
      filtered = filtered.filter((t) => t.date.startsWith(searchDate));
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchType, searchDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    filterTransactions();
  }, [filterTransactions]);

  const saveTransaction = async (transaction) => {
    try {
      await axios.post(`${API_URL}/transactions`, transaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error);
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const exportTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/export/excel`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting transactions:", error);
      setError('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    }
  };

  const handleSaveTransaction = (transaction) => {
    saveTransaction(transaction);
  };

  const handleDeleteTransaction = (id) => {
    deleteTransaction(id);
  };

  const handleExport = () => {
    exportTransactions();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl">Transaction</h2>

      {showForm && (
        <TransactionForm
          onSave={handleSaveTransaction}
          onCancel={() => setShowForm(false)}
          transaction={editingTransaction}
        />
      )}

      <div className="flex-container">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className=""
        >
          <option value="">ALl</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className=""
        />

        <button
          onClick={() => {
            setEditingTransaction(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          + Add Transaction
        </button>
      </div>

      <table className="">
        <thead>
          <tr className="">
            <th className="">Date</th>
            <th className="">List</th>
            <th className="">Type</th>
            <th className="">Amount</th>
            <th className="">Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction._id} className="">
              <td className="">
                {new Date(transaction.date).toISOString().split("T")[0]}
              </td>
              <td className="">{transaction.name}</td>
              <td className="">{transaction.type === "income" ? "Income" : "Expense"}</td>
              <td className="">{transaction.amount}</td>
              <td className="">
                <button
                  onClick={() => handleDeleteTransaction(transaction._id)}
                  className="bg-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        <div>
          <h2>Total</h2>
          {error && <div className="error">{error}</div>}
          {summary && (
            <div>
              <p>Income: {summary.income} Bath</p>
              <p>Expense: {summary.expense} Bath</p>
              <p>Summary: {summary.balance} Bath</p>
            </div>
          )}
        </div>
        <button className="bg-blue-500" onClick={handleExport}>Export Excel</button>
      </table>
    </div>
  );
};

export default Dashboard;
