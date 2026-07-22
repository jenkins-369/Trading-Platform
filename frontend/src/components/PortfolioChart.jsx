import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PortfolioChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const generateData = () => {
      const points = [];
      let value = 10000;
      for (let i = 0; i < 30; i++) {
        value = value + (Math.random() - 0.45) * 500;
        points.push({
          date: new Date(Date.now() - (30 - i) * 86400000).toLocaleDateString(),
          value: Math.round(value * 100) / 100,
        });
      }
      setData(points);
    };
    generateData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Portfolio Value']} />
        <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
