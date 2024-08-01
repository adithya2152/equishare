"use client";
import Card from "@/components/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import "@/app/styles/myrequest.css";

interface sentdetails {
  rid: number;
  sending_user: string;
  expense_title: string;
  split_amount: string;
  split_method: string;
  date_of_request: string;
  status: string;
}

interface ReceivedDetails {
  rid: number;
  sending_user: string;
  expense_title: string;
  split_amount: string;
  split_method: string;
  date_of_request: string;
}

export default function SplitDetails() {
  const [details, setDetails] = useState<sentdetails[]>([]);
  const [receivedDetails, setReceivedDetails] = useState<ReceivedDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/getmyrequests');

        if (res.status === 200) {
          const data = res.data;
          const mappedData = data.requests.map((detail: any) => ({
            rid: detail.rid,
            expense_title: detail.expense_title,
            sending_user: data.user.full_name,
            split_amount: detail.split_amt,
            split_method: detail.split_method,
            date_of_request: detail.dor,
            status: detail.status
          }));
          const receivedData = data.RecievedRequests.map((detail: any) => ({
            rid: detail.rid,
            expense_title: detail.expense_title,
            sending_user: data.user.full_name,
            split_amount: detail.split_amt,
            split_method: detail.split_method,
            date_of_request: detail.dor
          }));

          setReceivedDetails(receivedData);
          setDetails(mappedData);
          setLoading(false);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err: any) {
        console.error("Failed to fetch data: ", err);
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

  return (
    <Card>
    <div className="glass-effect">
        <div className="split-header">

        <Link href="/dashboard">Recieved Reqests</Link>
        </div>
      <div className="sent-request">
        <h1>Sent Requests</h1>
        <div className="request-container">
          {details.map((detail) => (
            <div className={`request-card glass-effect ${detail.status.toLowerCase()}`} key={detail.rid}>
              <p className="request-card-sending_user">Request From {detail.sending_user}</p>
              <p className="request-card-expense_title">Expense Title: {detail.expense_title}</p>
              <p className="request-card-split_amount">Amount: {detail.split_amount}</p>
              <p className="request-card-split_method">Split Method: {detail.split_method}</p>
              <p className="request-card-date_of_request">Date: {detail.date_of_request}</p>
              <p className={`request-card-status ${detail.status.toLowerCase()}`}>Status: {detail.status}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="received-request">
        <h1>Received Requests</h1>
        <div className="request-container">
          {receivedDetails.map((detail) => (
            <div className="request-card glass-effect" key={detail.rid}>
              <p className="request-card-sending_user">Request From {detail.sending_user}</p>
              <p className="request-card-expense_title">Expense Title: {detail.expense_title}</p>
              <p className="request-card-split_amount">Amount: {detail.split_amount}</p>
              <p className="request-card-split_method">Split Method: {detail.split_method}</p>
              <p className="request-card-date_of_request">Date: {detail.date_of_request}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>

  );
}
