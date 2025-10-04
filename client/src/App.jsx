import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import { SearchProvider } from './context/searchcontext';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import BlogPage from './pages/Blog';

const App = () => {
  return (
    <SearchProvider>
      <CartProvider> 
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                localStorage.getItem('adminUser') ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </SearchProvider>
  );
};

export default App;