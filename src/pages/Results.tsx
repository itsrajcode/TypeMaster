import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { wpm, errors, accuracy } = location.state || { wpm: 0, errors: 0, accuracy: 0 };

  const data = [
    { minute: 1, wpm: Math.round(wpm * 0.8), errors: Math.round(errors * 0.2) },
    { minute: 2, wpm: Math.round(wpm * 0.9), errors: Math.round(errors * 0.4) },
    { minute: 3, wpm: Math.round(wpm * 0.95), errors: Math.round(errors * 0.6) },
    { minute: 4, wpm: Math.round(wpm * 0.98), errors: Math.round(errors * 0.8) },
    { minute: 5, wpm, errors },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all duration-300 transform hover:scale-105">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Your Results</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg text-center shadow-md">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">Words Per Minute</h3>
            <p className="text-5xl font-bold text-purple-700 dark:text-purple-300">{Math.round(wpm)}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg text-center shadow-md">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Accuracy</h3>
            <p className="text-5xl font-bold text-blue-700 dark:text-blue-300">{Math.round(accuracy)}%</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg text-center shadow-md">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Total Errors</h3>
            <p className="text-5xl font-bold text-red-700 dark:text-red-300">{errors}</p>
          </div>
        </div>

        <div className="h-80 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="minute" label={{ value: 'Minute', position: 'bottom' }} />
              <YAxis yAxisId="left" label={{ value: 'WPM', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Errors', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="#8884d8" name="WPM" />
              <br />
              <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#82ca9d" name="Errors" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-md"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
