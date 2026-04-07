import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#1a1a2e] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-sm">E</div>
            <span className="text-lg font-semibold tracking-tight">ShopZone</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm transition">Home</Link>
            <Link to="/orders" className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm transition">Orders</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm transition flex items-center gap-1">
              <User size={15} /> Profile
            </Link>
            <Link to="/cart" className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm transition flex items-center gap-1">
              <ShoppingCart size={15} /> Cart
              {cartCount > 0 && (
                <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-2 transition">Login</Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
          <Link to="/" className="text-gray-300 hover:text-white py-2 text-sm">Home</Link>
          <Link to="/orders" className="text-gray-300 hover:text-white py-2 text-sm">Orders</Link>
          <Link to="/profile" className="text-gray-300 hover:text-white py-2 text-sm">Profile</Link>
          <Link to="/cart" className="text-gray-300 hover:text-white py-2 text-sm">Cart {cartCount > 0 && `(${cartCount})`}</Link>
          <Link to="/login" className="bg-violet-600 text-white px-4 py-2 rounded-md text-sm text-center">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;