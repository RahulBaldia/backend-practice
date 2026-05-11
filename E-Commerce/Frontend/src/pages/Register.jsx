import React, { useState } from 'react';
import API from '../api/api.js';  // folder nahi, directly file

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Saare fields bharo!');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Password match nahi kar raha!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye!');
      return;
    }
    try {
      await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert('Account ban gaya! 🎉');
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Kuch galat ho gaya!');
    }
  };

  // baaki JSX same rahega...
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-11 h-11 bg-[#1a1a2e] rounded-xl flex items-center justify-center text-xl mx-auto mb-3">✨</div>
          <h2 className="text-xl font-semibold text-[#1a1a2e]">Account banao</h2>
          <p className="text-sm text-gray-400 mt-1">Free mein register karo</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">Full Name</label>
          <input name="name" type="text" placeholder="Rahul Kumar" value={form.name} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition" />
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">Email</label>
          <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition" />
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-500 block mb-1">Password</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition" />
        </div>
        <div className="mb-5">
          <label className="text-sm text-gray-500 block mb-1">Confirm Password</label>
          <input name="confirm" type="password" placeholder="••••••••" value={form.confirm} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition" />
        </div>
        <button onClick={handleRegister}
          className="w-full bg-[#1a1a2e] hover:bg-violet-600 text-white py-3 rounded-lg text-sm font-medium transition mb-4">
          Create Account ✨
        </button>
        <p className="text-center text-sm text-gray-400">
          Pehle se account hai?{' '}
          <a href="/login" className="text-violet-500 font-medium hover:underline">Login karo</a>
        </p>
      </div>
    </div>
  );
};

export default Register;