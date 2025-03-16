import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransactionForm = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('income');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/transactions',
        { name, amount, date, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Transaction added:', response.data);
      
      setName('');
      setAmount('');
      setDate('');
      setType('income');

      window.location.reload();

    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Transaction</h2>
        <div className="control block-cube block-input">
          <input
            type="text"
            placeholder="Name List"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="bg"></div>
        </div>
        <div className="control block-cube block-input">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="bg"></div>
        </div>
        <div className="control block-cube block-input">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="bg"></div>
        </div>
        <div className="control block-cube block-input">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <div className="bg"></div>
        </div>
        <button className="btn block-cube block-cube-hover" type="submit">
          <div className="bg-top">
            <div className="bg-inner"></div>
          </div>
          <div className="bg-right">
            <div className="bg-inner"></div>
          </div>
          <div className="bg">
            <div className="bg-inner"></div>
          </div>
          <span className="text">Add Transaction</span>
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
