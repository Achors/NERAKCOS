import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { api, fetchApi } from '../api';

// === REMOVED API_URL (YOU DON'T NEED IT) ===

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, toast, showToast } = useCart();
  const paypalRef = useRef(null);
  const stripeRef = useRef(null);

  // === LOAD STRIPE ===
  useEffect(() => {
    if (!stripeRef.current && window.Stripe) {
      stripeRef.current = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    }
  }, []);

  // === REDIRECT IF CART EMPTY ===
  useEffect(() => {
    if (cartCount === 0) {
      navigate('/cart');
    }
  }, [cartCount, navigate]);

  // === FORM STATE ===
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: 'Netherlands',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('ideal');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === PREFILL EMAIL & NAME FROM LOCALSTORAGE ===
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setForm(prev => ({
        ...prev,
        email: user.email,
        fullName: user.name || prev.fullName,
      }));
    }
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shippingCost = 10;
  const grandTotal = total + shippingCost;

  // === PAYPAL BUTTON (MOCK) ===
  useEffect(() => {
    if (!paypalRef.current || paymentMethod !== 'paypal') return;

    paypalRef.current.innerHTML = '';
    window.paypal?.Buttons({
      style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'paypal' },
      createOrder: () => {
        showToast('PayPal: Connecting...');
        setTimeout(() => {
          showToast('PayPal: Payment successful!');
          setTimeout(() => navigate('/order-success?method=paypal'), 1500);
        }, 2000);
      }
    }).render(paypalRef.current);
  }, [paymentMethod, navigate, showToast]);

  // === STRIPE CHECKOUT ===
  const handleStripeCheckout = async () => {
    if (!stripeRef.current) {
      showToast('Stripe not loaded');
      return;
    }

    setLoading(true);
    showToast('Redirecting to Stripe...');

    try {
      const response = await fetchApi(api.checkout.createSession(), {
        method: 'POST',
        body: JSON.stringify({
          shipping: {
            name: form.fullName,
            phone: form.phone,
            address: {
              line1: form.address,
              city: form.city,
              country: form.country === 'Netherlands' ? 'NL' : 'DE',
              postal_code: '',
            },
          },
          success_url: `${window.location.origin}/order-success?method=stripe`,
          cancel_url: `${window.location.origin}/checkout`,
        }),
      });

      const { id: sessionId } = response;

      const { error } = await stripeRef.current.redirectToCheckout({ sessionId });
      if (error) showToast(error.message);
    } catch (err) {
      showToast(err.message || 'Payment failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === HANDLE SUBMIT ===
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      showToast('Please create an account to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (paymentMethod === 'paypal') return;

    const required = ['email', 'fullName', 'phone', 'address', 'city'];
    if (required.some(field => !form[field])) {
      showToast('Please fill all required fields');
      return;
    }

    handleStripeCheckout();
  };

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
          {/* LEFT: FULL FORM + PAYMENT */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
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
                    <option>Netherlands</option>
                    <option>Germany</option>
                    <option>Belgium</option>
                    <option>Austria</option>
                    <option>Spain</option>
                    <option>Italy</option>
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
              </form>
            </div>

            {/* PAYMENT METHODS */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-montserrat mb-4">Payment Method</h2>
              <div className="space-y-3">

                {/* iDEAL */}
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="ideal" checked={paymentMethod === 'ideal'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5" />
                    <div className="flex items-center gap-2">
                      <img src="/ideal.png" alt="iDEAL" className="h-8" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Pay via your bank</span>
                </label>

                {/* CARD */}
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5" />
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Visa, Mastercard</span>
                </label>

                {/* PAYPAL */}
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5" />
                    <div className="flex items-center gap-2">
                      <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" className="h-5" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Fast & secure</span>
                </label>
              </div>

              {/* PAYMENT ACTION */}
              <div className="mt-6">
                {paymentMethod === 'paypal' ? (
                  <div ref={paypalRef} className="paypal-button"></div>
                ) : (
                  // <button
                  //   onClick={handleSubmit}
                  //   disabled={loading}
                  //   className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition font-montserrat disabled:opacity-70"
                  // >
                  //   {loading ? 'Redirecting...' : `Pay €${grandTotal.toFixed(2)}`}
                  // </button>
                  <button
                        onClick={async () => {
                          try {
                            const res = await fetchApi(api.checkout.createSession(), {
                              method: 'POST',
                              body: JSON.stringify({
                                shipping: { name: 'Test User', phone: '+31612345678', address: { line1: 'Test 123', city: 'Amsterdam', country: 'NL' } },
                                success_url: `${window.location.origin}/order-success?method=stripe`,
                                cancel_url: `${window.location.origin}/checkout`,
                              }),
                            });
                            alert('Session created! ID: ' + res.id);
                            console.log('STRIPE SESSION:', res);
                          } catch (err) {
                            alert('ERROR: ' + err.message);
                            console.error(err);
                          }
                        }}
                        className="mt-4 p-2 bg-red-500 text-white rounded"
                      >
                        TEST STRIPE SESSION (NO PAYMENT)
                      </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-montserrat mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
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
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <p>Secure checkout • 256-bit SSL</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;