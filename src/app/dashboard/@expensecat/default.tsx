"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import Card from "@/components/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import styles from "./ExpenseCat.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseCat() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/expensecatpie');
        const data = res.data;

        const categories = data.map((item: any) => item.expense_category);
        const counts = data.map((item: any) => item.count);

        setChartData({
          labels: categories,
          datasets: [
            {
              label: 'Expense Categories',
              data: counts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            return tooltipItem.label;
          }
        }
      }
    }
  };

  return (
    <Card>
      <div className={styles.chartContainer}>
        <h1 className={styles.title}>Expense Category</h1>
        {chartData && <Pie data={chartData} options={options} />}
      </div>
    </Card>
  );
}
