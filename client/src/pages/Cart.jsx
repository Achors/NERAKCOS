import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { fetchApi, api } from '../api';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';


const Cart = () => {
  const {
    cartItems,
    cartCount,
    loading,
    toast,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  // Redirect if empty
  if (!loading && cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-6">Your cart is empty.</p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-montserrat text-center mb-8">Your Shopping Cart</h1>

        {toast && (
          <div className="max-w-2xl mx-auto mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
            {toast}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading cart...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4 border-b last:border-b-0"
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/80')}
                  />
                  <div className="flex-1">
                    <h3 className="font-montserrat text-lg">{item.name}</h3>
                    <p className="text-gray-600">€{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <p className="w-20 text-right font-semibold">
                    €{item.total.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-montserrat mb-4">Order Summary</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>€{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition font-montserrat"
              >
                Proceed to Checkout
              </button>
            </div>

            <div className="text-center mt-6">
              <Link to="/shop" className="text-gray-600 hover:text-black underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;