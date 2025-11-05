// This chart will show scan confidence scores over time, 
// using the item.id (which you use as a timestamp) for the x-axis. 
// This chart will have zoom and pan.

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale, // For the X-axis
  LinearScale, // For the Y-axis
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the date adapter
import zoomPlugin from 'chartjs-plugin-zoom'; // Import the zoom plugin
import Hammer from 'hammerjs'; // Import Hammer.js for touch gestures

// Register all required components
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin // Register the zoom plugin
);

export default function ScansOverTimeLine({ history }) {
  // Sort history by date and format for the chart
  const sortedHistory = [...history].sort((a, b) => new Date(a.id) - new Date(b.id));
  
  const chartData = sortedHistory.map(item => ({
    x: new Date(item.id), // Use the timestamp as the X-coordinate
    y: item.score,        // Use the score as the Y-coordinate
  }));

  const data = {
    datasets: [
      {
        label: 'Confidence Score',
        data: chartData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time', // Tell Chart.js this is a time-based axis
        time: {
          unit: 'day',
          tooltipFormat: 'PPpp', // Format for date-fns
        },
        title: {
          display: true,
          text: 'Date & Time of Scan',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Confidence Score (%)',
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Scan Scores Over Time (Drag or Scroll to Zoom/Pan)',
        font: { size: 16 }
      },
      // --- INTERACTIVITY CONFIGURATION ---
      zoom: {
        pan: {
          enabled: true,
          mode: 'x', // Pan along the X-axis
        },
        zoom: {
          wheel: {
            enabled: true, // Allow zooming with mouse wheel
          },
          pinch: {
            enabled: true, // Allow pinch-to-zoom on touch devices
          },
          drag: {
            enabled: true, // Allow click-and-drag zooming
            backgroundColor: 'rgba(75,192,192,0.2)'
          },
          mode: 'x', // Zoom along the X-axis
        },
      },
    },
  };

  return <Line options={options} data={data} />;
}