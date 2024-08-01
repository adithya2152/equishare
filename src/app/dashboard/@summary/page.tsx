"use client";
import Card from "@/components/card";
import { useState, useEffect } from "react";

import axios from "axios";
import  "../../styles/dashboard.css";
export default function Summary() {
    const [monthlydata, setmonthlydata] = useState('');
    const [dailydata, setdailydata] = useState('');
    const [yearlydata, setyearlydata] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/summary');

                if (response.status === 200) {
                    const data = response.data;
                    console.log("Data:", data);

                    setmonthlydata(data.monthly_avg);
                    setdailydata(data.daily_avg);
                    setyearlydata(data.yearly_avg);
                    setLoading(false);
                } else {
                    setError(`Failed to fetch summary data. Please try again. Error: ${response.data.error}`);
                }
            } catch (err: any) {
                console.error("Error:", err);
                setError(`Failed to fetch summary data. Please try again. Error: ${err.message}`);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return (
            <Card>
                <div className={"summary-container"}>
                    <h1 className={"error-message"}>Summary</h1>
                    <p>{error}</p>
                </div>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card>
                <div className={"summary-container"}>
                    <h1 className={"loading-message"}>Summary</h1>
                    <p>Loading...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className={"summary-container"}>
                <h1>Summary</h1>
                <div className={"summary-content"}>
                    <h2>Monthly Spend</h2>
                    <p>{monthlydata}</p>
                    <h2>Daily Spend</h2>
                    <p>{dailydata}</p>
                    <h2>Yearly Spend</h2>
                    <p>{yearlydata}</p>
                </div>
            </div>
        </Card>
    );
}
