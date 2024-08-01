// Client-side code

import { useState } from "react";
import "../app/styles/request.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

type Props = {
  details: {
    rid: number;
    expense_title: string;
    sending_user: string;
    split_amount: string;
    split_method: string;
    date_of_request: string;
  };
};

export default function Requests(props: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");
  const { sending_user, split_amount, split_method, date_of_request, rid , expense_title} = props.details;

  console.log("Details: ", props.details);
  const handleResponse = async (type: string) => {
    setLoading(true);
    try {
      const res = await axios.patch(`/api/handleresponse?response=${type}&rid=${rid}`);
      if (res.status === 200) {
        setResponse(type);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)}d!`);
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)}d:`, props.details);
      } else {
        throw new Error("Failed to update response");
      }
    } catch (err: any) {
      console.error("Failed to handle response: ", err);
      setError("Failed to handle response: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requests-card">
      <p className="requests-card-sending_user">Request From {sending_user}</p>
      <p className="requests-card-expense_title">Expense Title: {expense_title}</p>
      <p className="requests-card-split_amount">Amount: {split_amount}</p>
      <p className="requests-card-split_method">Split Method: {split_method}</p>
      <p className="requests-card-date_of_request">Date: {date_of_request}</p>
      <div className="requests-card-buttons">
        <button
          className="requests-card-button requests-card-accept"
          onClick={() => handleResponse("accept")}
        >
          Accept
        </button>
        <button
          className="requests-card-button requests-card-reject"
          onClick={() => handleResponse("reject")}
        >
          Reject
        </button>
      </div>
      <Toaster />
    </div>
  );
}
