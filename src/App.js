import React from 'react';
import Charts from './components/Charts';

function App() {
  return (
    <div className="bg-gray-900 min-h-screen p-10">
      <h1 className="text-4xl text-white text-center mb-10">Network Alert Dashboard</h1>
      <Charts />
    </div>
  );
}

export default App;
