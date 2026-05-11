import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<Home setCartCount={setCartCount} />} />
        <Route path="/cart" element={<Cart setCartCount={setCartCount} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;