import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartCount, toast } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-montserrat text-center mb-6">Your Cart</h2>
          <p className="text-center">You have {cartCount} items in your cart.</p>
          {toast && <p className="text-center text-green-500 mt-2">{toast}</p>}
          <Link to="/shop" className="mt-4 w-full bg-black text-white p-2 rounded hover:bg-gray-800 block text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;