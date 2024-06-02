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
    return <div className="text-white text-center">Loading...</div>;
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-white text-center">Number of Alerts per Destination Port</h2>
        <Bar data={barChartData} />
      </div>
      <div className="p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-white text-center">Distribution of Alerts by Category</h2>
        <Pie data={pieChartData} />
      </div>
      <div className="p-4 bg-gray-800 rounded-lg shadow-md col-span-2">
        <h2 className="text-white text-center">Alerts Over Time</h2>
        <Line data={lineChartData} />
      </div>
    </div>
  );
}
export default Charts;