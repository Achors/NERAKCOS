import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, checkout, toast } = useCart();

  // Redirect if cart empty
  if (cartCount === 0) {
    navigate('/cart');
    return null;
  }

  const [form, setForm] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: 'Germany',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod] = useState('cod'); // or get from context later

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const shipping = {
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      address: `${form.address}, ${form.city}, ${form.country}`,
      notes: form.notes || null,
    };

    const success = await checkout(shipping, paymentMethod);
    setLoading(false);

    if (success) {
    const response = await fetchApi(api.checkout(), {
      method: 'POST',
      body: JSON.stringify({ shipping, payment_method: paymentMethod }),
    });
    

    navigate(`/order-success?order_id=${response.order_id}`);
  }
  };

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shippingCost = 15;
  const grandTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-montserrat text-center mb-8">Checkout</h1>

        {toast && (
          <div className="max-w-2xl mx-auto mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
            {toast}
          </div>
        )}

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-montserrat mb-4">Shipping & Contact</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone *"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                name="address"
                placeholder="Street Address *"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option>Germany</option>
                  <option>Austria</option>
                  <option>Switzerland</option>
                </select>
              </div>
              <textarea
                name="notes"
                placeholder="Order notes (optional)"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition font-montserrat disabled:opacity-70"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-montserrat mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>€{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>€{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>€{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-sm font-montserrat">
                Payment: <strong>Cash on Delivery</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;