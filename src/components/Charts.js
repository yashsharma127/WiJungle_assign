import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Charts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-white text-center text-xl">Loading...</div>;
  }

  const validData = data.filter(item =>
    item.dest_port !== undefined &&
    item.alert?.category !== undefined &&
    item.timestamp !== undefined &&
    item.flow_id !== undefined
  );

  const uniqueDestPorts = [...new Set(validData.map(item => item.dest_port))];
  const barChartData = {
    labels: uniqueDestPorts,
    datasets: [{
      label: 'Number of Alerts',
      data: uniqueDestPorts.map(port => validData.filter(item => item.dest_port === port).length),
      backgroundColor: '#1f77b4',
    }]
  };

  const uniqueCategories = [...new Set(validData.map(item => item.alert.category))];
  const pieChartData = {
    labels: uniqueCategories,
    datasets: [{
      label: 'Distribution of Alerts',
      data: uniqueCategories.map(category => validData.filter(item => item.alert.category === category).length),
      backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
    }]
  };

  const lineChartData = {
    labels: validData.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Alerts Over Time',
      data: validData.map(item => item.flow_id),
      backgroundColor: '#ff7f0e',
      fill: false,
      borderColor: '#ff7f0e'
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg relative">
        <div className="absolute inset-0 bg-gray-900 opacity-50 rounded-lg"></div>
        <h2 className="text-white text-center text-2xl mb-4 font-bold relative z-10">Number of Alerts per Destination Port</h2>
        <div className="h-64 relative z-10">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg relative">
        <div className="absolute inset-0 bg-gray-900 opacity-50 rounded-lg"></div>
        <h2 className="text-white text-center text-2xl mb-4 font-bold relative z-10">Distribution of Alerts by Category</h2>
        <div className="h-64 relative z-10">
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg col-span-1 md:col-span-2 relative">
        <div className="absolute inset-0 bg-gray-900 opacity-50 rounded-lg"></div>
        <h2 className="text-white text-center text-2xl mb-4 font-bold relative z-10">Alerts Over Time</h2>
        <div className="h-96 relative z-10">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
export default Charts;
