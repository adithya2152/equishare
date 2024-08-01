"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast , {Toaster} from "react-hot-toast";
import Header from "@/components/header";
import "../styles/getexpense.css";

interface ExpenseLog {
  expensetitle: string;
  amount: string;
  date: string;
  uid: string;
  eid: string;
}

export default function ExpenseLogs() {
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseLog | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getexpense");

        if (res.status === 200) {
          const data = res.data;
          const mappedData = data.map((expense: any) => ({
            expensetitle: expense.expense_title,
            amount: expense.total_expense,
            date: expense.date,
            uid: expense.uid,
            eid: expense.eid,
          }));
          setExpenses(mappedData);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err: any) {
        setError("Failed to fetch data: " + err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleSplit = (expense: ExpenseLog) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedExpense(null);
  };

  const handleSplitSubmit = async (splitData: any) => {
    try {
      const res = await axios.post("/api/sendrequest", { splitdata: splitData });
      if (res.status === 200) {
        toast.success(`Split request sent for expense ID: ${splitData.eid}`);
        setShowModal(false);
      } else {
        throw new Error("Failed to send split request");
      }
    } catch (error: any) {
      toast.error("Failed to send split request: " + error.message);
    }
  };

  return (
    <div>
      <Header />
      <Toaster />
      <div className="expense-logs">
        <h1>Expense Logs</h1>
        <div className="grid-container">
          {expenses.map((expense, index) => (
            <div key={index} className="expense-card-container">
              <div className="expense-card">
                <h2>{expense.expensetitle}</h2>
                <p>Amount: {expense.amount}</p>
                <p>Date: {expense.date}</p>
                <p>UID: {expense.uid}</p>
              </div>
              <div className="button-container">
                <button onClick={() => handleSplit(expense)} className="action-button">
                  Split
                </button>
                <button className="action-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {showModal && selectedExpense && (
         <div>
          
         </div>
        )}
      </div>
    </div>
  );
}
