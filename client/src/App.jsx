import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import Home from './pages/Home'
import Shop from './pages/Shop';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import {SearchProvider} from './pages/searchcontext';
import Navbar from './components/Navbar';
import AdminPanel from './pages/adminpanel';

const App = () => {
  return (
    <SearchProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </SearchProvider>
    
  );
};

export default App;
