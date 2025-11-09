
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [orderId, setOrderId] = useState('N/A');

  // Get orderId from URL (we'll pass it as query param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('order_id');
    if (id) {
      setOrderId(id);
    } else if (cartItems.length > 0) {
      // Fallback: redirect if cart not empty
      navigate('/checkout');
    }
  }, [cartItems, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-3xl font-montserrat text-green-600 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-700 mb-2">
            Thank you for your purchase.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Order ID: <strong>{orderId}</strong>
          </p>
          <p className="text-gray-600 mb-6">
            Admin will contact you soon to confirm payment and delivery.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition font-montserrat"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;