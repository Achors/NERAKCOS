import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import Home from './pages/Home'
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import {SearchProvider} from './pages/searchcontext';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import BlogPage from './pages/Blog';

const App = () => {
  return (
    <SearchProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin/*"
            element={
              localStorage.getItem('adminUser') ? <AdminDashboard /> : <Navigate to="/admin/login" />
            }
          />
        </Routes>
      </Router>
    </SearchProvider>
    
  );
};

export default App;
