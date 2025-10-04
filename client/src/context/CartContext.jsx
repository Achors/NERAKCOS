import { createContext, useContext, useState, useEffect } from 'react';
import { api, fetchApi } from '../api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(() => {
    return parseInt(localStorage.getItem('cartCount') || '0');
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  const addToCart = async (productId) => {
    try {
      const response = await fetchApi(api.orders.create(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      setCartCount(prev => prev + 1);
      setToast('Item added to cart! Admin will review soon.');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      const message = err.status === 401 ? 'Please log in to add to cart.' : 'Error adding to cart. Try again.';
      setToast(message);
      setTimeout(() => setToast(''), 3000);
      if (err.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart, toast }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);