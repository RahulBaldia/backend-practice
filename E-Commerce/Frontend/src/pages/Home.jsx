import React, { useState, useEffect } from 'react';
import API from '../api/api';

const Home = ({ setCartCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products/getProducts')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const addToCart = async (productId) => {
    try {
      await API.post('/cart/addProduct', { productId, quantity: 1 });
      setCartCount(prev => prev + 1);
      alert('Cart mein add ho gaya! 🛒');
    } catch (err) {
      alert('Pehle login karo!');
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-6">All Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map(p => (
          <div key={p._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
            <div className="bg-gray-100 h-40 flex items-center justify-center text-5xl">🛍️</div>
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-1">{p.category}</p>
              <h3 className="text-sm font-medium text-[#1a1a2e] mb-1">{p.name}</h3>
              <p className="text-violet-600 font-semibold mb-3">₹{p.price}</p>
              <button onClick={() => addToCart(p._id)}
                className="w-full bg-[#1a1a2e] hover:bg-violet-600 text-white text-sm py-2 rounded-lg transition">
                Add to Cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;