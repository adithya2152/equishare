"use client"
import { useState, useEffect } from "react"
import Card from "@/components/card"
import axios from "axios"
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement)

export default function MonthSpend() {
    const [monthlyExpenses, setMonthlyExpenses] = useState(Array(12).fill(0))
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/monthlyspend')

                if (response.status === 200) {
                    setLoading(false)
                    const data = response.data
                    console.log("Data fetched successfully", data)

                    setMonthlyExpenses(data)
                } else {
                    throw new Error(`Failed to fetch monthly spend data. Please try again. Error: ${response.data.error}`)
                }
            } catch (err) {
                setError("Failed to fetch monthly spend data. Please try again.")
                setLoading(false)
                console.error("Error:", err)
            }
        }

        fetchData()
    }, [])

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Monthly Spend',
                data: monthlyExpenses,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                pointBorderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    }

    const options = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        }
    }

    if (loading) {
        return <Card>Loading...</Card>
    }

    if (error) {
        return <Card>{error}</Card>
    }

    if (monthlyExpenses.length === 0) {
        return <Card>No data available</Card>
    }

    return (
        <Card>
            <div className="chart">
                <h1>Monthly Spend</h1>
                <div className="chart-container">
                    <Line
                        data={data}
                        options={options}
                    />
                </div>
            </div>
        </Card>
    )
}
