import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import Home from './pages/Home'
import Shop from './pages/Shop';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;
