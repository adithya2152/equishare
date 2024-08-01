"use client";
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import Header from "@/components/header";
import toast, { Toaster } from "react-hot-toast";
import "../styles/addexpense.css"

interface Expense {
  expensetitle: string;
  amount: string;
  splitExpense: string;
  expensecategory: string;
}

interface User {
  id: string;
  splitAmt: string;
}

export default function AddExpense() {
  const [expense, setExpense] = useState<Expense>({
    expensetitle: '',
    amount: '',
    splitExpense: '',
    expensecategory: '',
  });
  const [splitmethod, setSplitMethod] = useState('equal');
  const [mysplit, setMySplit] = useState('');
  const [splitcount, setSplitCount] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate and set split values when necessary
  const calculateSplits = useCallback(() => {
    if (!expense.amount || !splitcount) return;
    const Amount = parseFloat(expense.amount);

    if (splitmethod === 'equal') {
      if (!isNaN(Amount) && parseInt(splitcount) > 0) {
        const totalSplitAmount = Amount / (parseInt(splitcount) + 1);
        setUsers(users.map((user) => ({ ...user, splitAmt: totalSplitAmount.toString() })));
        setMySplit(totalSplitAmount.toString());
      }
    } else if (splitmethod === 'exact') {
      if (!isNaN(Amount) && parseInt(splitcount) > 0) {
        const sum = users.reduce((acc, user) => acc + parseFloat(user.splitAmt || "0"), 0);
        if (sum > Amount) {
          setError('Total Split amount cannot exceed the expense amount');
        } else if (sum < Amount) {
          setMySplit((Amount - sum).toString());
        } else {
          setError('Total Split amount should be equal to the expense amount');
        }
      }
    }
  }, [expense.amount, splitcount, splitmethod, users]);


  useEffect(() => {
    if (splitmethod === 'equal' || splitmethod === 'exact') {
      calculateSplits();
    }
  }, [splitmethod, users, expense.amount, splitcount, calculateSplits]);

  function handleSplitCount(e: React.ChangeEvent<HTMLInputElement>) {
    const count = parseInt(e.target.value);
    setSplitCount(e.target.value);
    setUsers(Array.from({ length: count }, () => ({ id: '', splitAmt: '' })));
    setError(null);
  }

  const handleUserChange = (index: number, field: keyof User, value: string) => {
    const newUsers = [...users];

    if (field === 'id') {
      if (newUsers.some((user, i) => user.id === value && i !== index)) {
        setError('Duplicate user ID entered. Please enter a unique user ID.');
        return;
      } else {
        setError(null);
      }
    }

    newUsers[index][field] = value;                                         
    setUsers(newUsers);
  };                              ``

  const handleSplitReqSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!expense.expensetitle || !expense.amount || !expense.splitExpense) {
      const message = 'Please fill in all required fields.';
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    const totalsplitamt = parseFloat(expense.amount) - parseFloat(mysplit);
    const splitData = {
      expense,
      amount: parseFloat(expense.amount),
      splitmethod,
      totalsplitamt,
      users
    };


    console.log("Submitting split request with data:", splitData);

    try {
      const response = await axios.post('/api/sendrequest', {
        splitdata: splitData

      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Split request result:', response.data);

      if (response.status === 200) {
        setExpense({ expensetitle: '', amount: '', splitExpense: '', expensecategory: '' });
        setSplitMethod('equal');
        setMySplit('');
        setSplitCount('');
        setUsers([]);
        setError(null);
        toast.success('Split request submitted successfully.');
      } else {
        const errorMessage = response.data?.error || 'Failed to submit split request. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error('Error submitting split request:', err);
      const errorMessage = err.response?.data?.error || 'Failed to submit split request. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const HandleExpenseSubmit = async(e:React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    setLoading(true);

    if (!expense.expensetitle || !expense.amount || !expense.splitExpense) {
      const message = 'Please fill in all required fields.';
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    console.log("Submitting expense with data:", expense);



     try {

      const res = await axios.post("/api/setexpense", {
        expense: expense}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Expense result:", res.data);

      if (res.status === 200) {
        setExpense({ expensetitle: '', amount: '', splitExpense: '', expensecategory: '' });
        toast.success('Expense submitted successfully.');
      }
      else
      {
        const errorMessage = res.data?.error || 'Failed to submit expense. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
     } catch (err: any) {
      console.error('Error submitting expense:', err);
      const errorMessage = err.response?.data?.error || 'Failed to submit expense. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
     }
  }

  return (
    <div>
      <Header/>
    <div className="container">
      <form className="expense-form">
        <label htmlFor="expensetitle">Expense Title</label>
        <input
          type="text"
          name="expensetitle"
          onChange={(e) => setExpense({ ...expense, expensetitle: e.target.value })}
          value={expense.expensetitle}
          placeholder="Expense Title"
          required
        />

        <select onChange={(e) => setExpense({ ...expense, expensecategory: e.target.value })}   value={expense.expensecategory} name="category"  >
          <option value="">Select Category</option>
          <option value="Food">Food</option>                                  
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>                                                                                                                                          
        </select>

        <label htmlFor="amount">Expense Amount</label>
        <input
          type="text"
          name="amount"
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
          value={expense.amount}
          placeholder="Expense Amount"
          required
        />

        <p>Split Expense</p>
        <div className="radio">

          <label htmlFor="yes">Yes</label>
          <input
            type="radio"
            name="splitExpense"
            value="yes"
            onChange={(e) => setExpense({ ...expense, splitExpense: e.target.value })}
            checked={expense.splitExpense === 'yes'}
          />

        </div>
        
        <div className="radio">
          <label htmlFor="no">No</label>
          <input
            type="radio"
            name="splitExpense"
            value="no"
            onChange={(e) => setExpense({ ...expense, splitExpense: e.target.value })}
            checked={expense.splitExpense === 'no'}
          />
        </div>
        

        {expense.splitExpense === 'yes' && (
          <div className="split-section">
            <label htmlFor="splitmethod">Split Method</label>
            <select
              name="splitmethod"
              onChange={(e) => setSplitMethod(e.target.value)}
              value={splitmethod}
              required
            >
              <option value="equal">Equal</option>
              <option value="exact">Exact</option>
              <option value="custom">Percentage</option>
            </select>
            <label htmlFor="splitcount">Split Count</label>
            <input
              type="number"
              name="splitcount"
              onChange={handleSplitCount}
              value={splitcount}
              placeholder="Split Count"
              required
            />
            {splitmethod === 'equal' && (
            <div className="user-input-container">
              {users.map((user, index) => (
                <div className="split-cred" key={index}>
                  <label htmlFor={`userid-${index}`}>UserId {index + 1}</label>
                  <input
                    type="text"
                    name={`userid-${index}`}
                    placeholder="User Id"
                    required
                    value={user.id}
                    onChange={(e) => handleUserChange(index, 'id', e.target.value)}
                  />
                  <label htmlFor={`splitAmt-${index}`}>Split Amount</label>
                  <input
                    type="text"
                    name={`splitAmt-${index}`}
                    placeholder="Split Amount"
                    readOnly
                    value={user.splitAmt}
                    onChange={(e) => handleUserChange(index, 'splitAmt', e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {splitmethod === 'exact' && (
            <div className="user-input-container">
              {users.map((user, index) => (
                <div className="split-cred" key={index}>
                  <label htmlFor={`userid-${index}`}>UserId {index + 1}</label>
                  <input
                    type="text"
                    name={`userid-${index}`}
                    placeholder="User Id"
                    required
                    value={user.id}
                    onChange={(e) => handleUserChange(index, 'id', e.target.value)}
                  />
                  <label htmlFor={`splitAmt-${index}`}>Split Amount</label>
                  <input
                    type="text"
                    name={`splitAmt-${index}`}
                    placeholder="Split Amount"
                    required
                    value={user.splitAmt}
                    onChange={(e) => handleUserChange(index, 'splitAmt', e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}


            <button type="submit" onClick={handleSplitReqSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Send Split Request'}
            </button>
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
          </div>
        )}

        {expense.splitExpense === 'no' && (
          <div>
            <button type="submit" onClick={HandleExpenseSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Add Expense'}
            </button>
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
      </form>

      <Toaster />                                                                                 
    </div>

    </div>
  );
}
