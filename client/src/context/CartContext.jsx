import { createContext, useContext, useState, useEffect } from 'react';
import { api, fetchApi } from '../api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // === Load Cart from Backend ===
  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(api.cart.list());
      setCartItems(data);
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadCart();
  }, []);

  // === Show Toast ===
  const showToast = (msg, duration = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(''), duration);
  };

  // === ADD TO CART ===
  const addToCart = async (productId, quantity = 1) => {
    try {
      await fetchApi(api.cart.add(), {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      showToast('Added to cart!');
      await loadCart();
    } catch (err) {
      showToast('Failed to add item');
    }
  };

  // === UPDATE QUANTITY ===
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await fetchApi(api.cart.update(itemId), {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      await loadCart();
    } catch (err) {
      showToast('Update failed');
    }
  };

  // === REMOVE ITEM ===
  const removeFromCart = async (itemId) => {
    try {
      await fetchApi(api.cart.remove(itemId), { method: 'DELETE' });
      await loadCart();
    } catch (err) {
      showToast('Remove failed');
    }
  };

  // === CHECKOUT ===
  const checkout = async (shipping, paymentMethod) => {
    try {
      await fetchApi(api.checkout(), {
        method: 'POST',
        body: JSON.stringify({ shipping, payment_method: paymentMethod }),
      });
      setCartItems([]);
      setCartCount(0);
      showToast('Order placed!');
      return response;
    } catch (err) {
      showToast(err.message || 'Checkout failed');
      throw err;
    }
  };

  // === MERGE ON LOGIN (Call from Login.jsx) ===
  const mergeOnLogin = async () => {
    await loadCart(); // Backend auto-merges via cookie
    showToast('Cart synced!');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        toast,
        addToCart,
        updateQuantity,
        removeFromCart,
        checkout,
        mergeOnLogin,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};