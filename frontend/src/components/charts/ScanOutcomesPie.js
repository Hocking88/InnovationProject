//This chart shows the simple breakdown of "SAFE" vs. "MALICIOUS" scans from the history.
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function ScanOutcomesPie({ history }) {
  // Process the history data
  const safeCount = history.filter(item => item.status === 'SAFE').length;
  const maliciousCount = history.filter(item => item.status === 'MALICIOUS').length;

  const data = {
    labels: ['Safe', 'Malicious'],
    datasets: [
      {
        label: 'Scan Count',
        data: [safeCount, maliciousCount],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Green for Safe
          'rgba(255, 99, 132, 0.6)',  // Red for Malicious
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
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
        text: 'Scan Outcomes',
        font: { size: 16 }
      },
    },
  };

  return <Pie data={data} options={options} />;
}