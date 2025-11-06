//This chart will count how many scans of each type (e.g., 'File', 'Text') you have.
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ScanTypesBar({ history }) {
  // Process history to count scans by type
  const typeCounts = history.reduce((acc, item) => {
    const type = item.type || 'Unknown'; // Handle undefined type
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(typeCounts);
  const dataPoints = Object.values(typeCounts);

  const data = {
    labels,
    datasets: [
      {
        label: 'Number of Scans',
        data: dataPoints,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Scans by Type',
        font: { size: 16 }
      },
    },
  };

  return <Bar options={options} data={data} />;
}