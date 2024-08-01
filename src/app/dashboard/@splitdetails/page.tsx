"use client";
import Card from "@/components/card";
import Requests from "@/components/requests";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios';

interface Details {
  rid: number;
  sending_user: string;
  expense_title: string;
  split_amount: string;
  split_method: string;
  date_of_request: string;
}

export default function SplitDetails() {
  const [details, setDetails] = useState<Details[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/getrequests');

        if (res.status === 200) {
          const data = res.data;
          const mappedData = data.requests.map((detail: any) => ({
            rid:detail.rid,
            expense_title: detail.expense_title,
            sending_user: data.user.full_name, 
            split_amount: detail.split_amt, 
            split_method: detail.split_method,
            date_of_request: detail.dor,
          }));

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
      <div>
        <div className="request-header">
          <h1>Split Details</h1>
          <Link href="/dashboard/mysplits">My Splits</Link>
        </div>
        <div className="requests-container">

         
          {details.map((detail, index) => (
            <Requests key={index} details={detail} />
          ))}
        

        </div>
        <div className="requests-empty">
            {details.length === 0 && <p>No requests found</p>}
          </div>
      </div>
    </Card>
  );
}
