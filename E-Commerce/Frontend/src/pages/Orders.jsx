import React, { useState, useEffect } from 'react';
import API from '../api/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/order/getOrder')
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-6">My Orders 📦</h2>

      {orders.length === 0 || orders.message ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg">Koi order nahi hai abhi!</p>
        </div>
      ) : (
        <div className="max-w-2xl flex flex-col gap-4">
          {orders.map((order, index) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-4">

              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-[#1a1a2e]">Order #{index + 1}</p>
                <span className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full border border-green-200">
                  Placed ✅
                </span>
              </div>

              {/* Order Items */}
              {order.items.map(item => (
                <div key={item._id} className="flex items-center gap-3 py-2 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🛍️</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a2e]">{item.product.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-violet-600 font-semibold text-sm">₹{item.product.price}</p>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-sm font-semibold text-[#1a1a2e]">
                  ₹{order.total || order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;