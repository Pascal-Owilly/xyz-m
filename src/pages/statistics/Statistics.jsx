// StatisticsChartComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { BASE_URL } from '../auth/config';
const StatisticsChartComponent = () => {
const baseUrl = BASE_URL;
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: ['Breed Supply '], // Add your X-axis categories here
      },
    },
    series: [{
      name: 'Data Series',
      data: ['Breed Demand'], // Add your Y-axis data here
    }],
  });

  useEffect(() => {
    // Fetch statistical data from your API
    axios.get(`${baseUrl}/api/breeder_totals/`)
      .then(response => {
        const newData = {
          options: {
            ...chartData.options,
            xaxis: {
              categories: response.data.categories,
            },
          },
          series: [{
            name: 'Data Series',
            data: response.data.data,
          }],
        };
        setChartData(newData);
      })
      .catch(error => console.error('Error fetching statistical data:', error));
  }, []); // Ensure that the effect runs only once on component mount

  return (
    <div>
      <h2>Breed Supply and Demmand </h2>
      <Chart options={chartData.options} series={chartData.series} type="bar" height={400} />
    </div>
  );
};

export default StatisticsChartComponent;
