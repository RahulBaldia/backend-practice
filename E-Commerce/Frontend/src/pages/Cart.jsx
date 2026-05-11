import React, { useState, useEffect } from 'react';
import API from '../api/api';

const Cart = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/cart/getCart')
      .then((res) => {
        const items = res.data.items || [];
        setCartItems(items);
        setCartCount(items.length);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await API.patch(`/cart/updateProduct/${productId}`, { quantity });
      setCartItems(prev =>
        prev.map(item =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/removeProduct/${productId}`);
      setCartItems(prev => prev.filter(item => item.product._id !== productId));
      setCartCount(prev => prev - 1);
    } catch (err) {
      console.log(err);
    }
  };

  const placeOrder = async () => {
    try {
      await API.post('/order/createOrder');
      alert('Order place ho gaya! 🎉');
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      alert('Order place nahi ho paaya!');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-6">My Cart 🛒</h2>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-lg">Tera cart khali hai!</p>
        </div>
      ) : (
        <div className="max-w-2xl flex flex-col gap-4">
          {cartItems.map(item => (
            <div key={item.product._id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">🛍️</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1a1a2e]">{item.product.name}</p>
                <p className="text-violet-600 font-semibold">₹{item.product.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.product._id, item.quantity - 1)}
                  className="w-7 h-7 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-lg transition">−</button>
                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item.product._id, item.quantity + 1)}
                  className="w-7 h-7 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-lg transition">+</button>
              </div>
              <button onClick={() => removeItem(item.product._id)}
                className="text-red-400 hover:text-red-600 text-xs ml-2 transition">✕ Remove</button>
            </div>
          ))}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mt-2">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Subtotal</span><span>₹{total}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">Delivery</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between mb-4">
              <span className="font-medium text-[#1a1a2e]">Total</span>
              <span className="font-semibold text-violet-600">₹{total}</span>
            </div>
            <button onClick={placeOrder}
              className="w-full bg-[#1a1a2e] hover:bg-violet-600 text-white py-3 rounded-lg text-sm font-medium transition">
              Place Order →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;