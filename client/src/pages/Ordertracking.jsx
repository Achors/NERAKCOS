import { useState, useEffect } from 'react';
import { api, fetchApi } from '../api';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await fetchApi(api.orders.list());
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Product Name</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Total Price</th>
            <th className="p-2">Status</th>
            <th className="p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.product_name}</td>
              <td className="p-2">{order.quantity}</td>
              <td className="p-2">${order.total_price.toFixed(2)}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2">{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTracking;