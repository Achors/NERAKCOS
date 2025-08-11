import { useState, useEffect } from 'react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, topItems: [] });

  useEffect(() => {
    setStats({
      totalOrders: 150,
      totalRevenue: 12500.50,
      topItems: ['Handbag', 'Backpack', 'Tote'],
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Top Items</h3>
          <ul>
            {stats.topItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* Placeholder for Chart.js */}
      <div className="mt-6 bg-white p-4 rounded shadow">Chart Placeholder</div>
    </div>
  );
};

export default DashboardOverview;