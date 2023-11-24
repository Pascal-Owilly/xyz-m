import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Sample data for ApexCharts
const chartData = {
  options: {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: ['Category 1', 'Category 2', 'Category 3'],
    },
  },
  series: [
    {
      name: 'Series 1',
      data: [30, 40, 45],
    },
  ],
};

const chart = new ApexCharts(document.getElementById('chart'), chartData.options);
chart.render();
