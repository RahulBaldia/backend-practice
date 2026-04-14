import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email aur password dono bharo!');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful! 🎉');
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Server se connection nahi ho paaya!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 bg-[#1a1a2e] rounded-xl flex items-center justify-content text-xl mx-auto mb-3">🛒</div>
          <h2 className="text-xl font-semibold text-[#1a1a2e]">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-1">Apne account mein login karo</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <label className="text-sm text-gray-500">Password</label>
            <a href="#" className="text-xs text-violet-500 hover:underline">Forgot password?</a>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#1a1a2e] hover:bg-violet-600 text-white py-3 rounded-lg text-sm font-medium transition mb-4"
        >
          Login →
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-400">
          Account nahi hai?{' '}
          <a href="/register" className="text-violet-500 font-medium hover:underline">Register karo</a>
        </p>

      </div>
    </div>
  );
};

export default Login;