import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const initialCartItems = [
  { id: 1, name: "Sony WH-1000XM5 Headphones", price: 29999, originalPrice: 34999, qty: 1, img: "🎧", category: "Headphones" },
  { id: 2, name: "Apple AirPods Pro 2nd Gen", price: 24900, originalPrice: 26900, qty: 2, img: "🎵", category: "TWS Earbuds" },
  { id: 3, name: "Samsung Galaxy S24", price: 74999, originalPrice: 89999, qty: 1, img: "📱", category: "Smartphones" },
];

const COUPONS = { "CROMA10": 10, "SAVE20": 20, "FIRST15": 15 };

function FreeShippingBar({ subtotal }) {
  const threshold = 50000;
  const progress = Math.min((subtotal / threshold) * 100, 100);
  const remaining = threshold - subtotal;
  return (
    <div className="mb-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
      <div className="flex justify-between mb-2">
        <span className="text-[12px] text-zinc-400">
          {progress >= 100 ? "🎉 You get FREE delivery!" : `Add ₹${remaining.toLocaleString()} more for FREE delivery`}
        </span>
        <span className="text-[12px] text-green-400 font-semibold">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function CartItem({ item, onQtyChange, onRemove, onSaveLater }) {
  const itemTotal = item.price * item.qty;
  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors"
    >
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-zinc-900 flex items-center justify-center text-4xl border border-zinc-800">
        {item.img}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] font-semibold text-white leading-snug mb-1">{item.name}</p>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{item.category}</span>
          </div>
          <button onClick={() => onRemove(item.id)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-white">₹{item.price.toLocaleString()}</span>
          <span className="text-[12px] text-zinc-600 line-through">₹{item.originalPrice.toLocaleString()}</span>
          <span className="text-[11px] text-green-400 font-semibold">{discount}% off</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty */}
          <div className="flex items-center gap-2">
            <button onClick={() => onQtyChange(item.id, -1)}
              className="w-8 h-8 rounded-xl border border-zinc-700 bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-all disabled:opacity-40"
              disabled={item.qty <= 1}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <span className="w-8 text-center text-sm font-bold text-white">{item.qty}</span>
            <button onClick={() => onQtyChange(item.id, 1)}
              className="w-8 h-8 rounded-xl border border-zinc-700 bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => onSaveLater(item.id)}
              className="text-[12px] text-cyan-400 hover:text-cyan-300 transition-colors">
              Save for Later
            </button>
            <span className="text-sm font-bold text-white">₹{itemTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="font-['Syne'] text-3xl font-black text-white mb-3">Your cart is empty</h2>
      <p className="text-zinc-400 mb-8 max-w-sm">Looks like you haven't added anything yet. Start exploring our products!</p>
      <motion.button
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/")}
        className="bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-cyan-300 transition-colors">
        Start Shopping →
      </motion.button>
    </motion.div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialCartItems);
  const [savedItems, setSavedItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleQtyChange = (id, delta) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const handleRemove = (id) => setItems(prev => prev.filter(item => item.id !== id));

  const handleSaveLater = (id) => {
    const item = items.find(i => i.id === id);
    setSavedItems(prev => [...prev, item]);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleMoveToCart = (id) => {
    const item = savedItems.find(i => i.id === id);
    setItems(prev => [...prev, { ...item, qty: 1 }]);
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, discount: COUPONS[code] });
      setCouponSuccess(`${COUPONS[code]}% discount applied!`);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponSuccess("");
      setAppliedCoupon(null);
    }
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const originalTotal = items.reduce((sum, i) => sum + i.originalPrice * i.qty, 0);
  const itemDiscount = originalTotal - subtotal;
  const couponDiscount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount / 100) : 0;
  const delivery = subtotal >= 50000 ? 0 : 99;
  const total = subtotal - couponDiscount + delivery;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[3px] text-cyan-400 mb-2">Shopping</p>
          <h1 className="font-['Syne'] text-4xl font-black text-white">Your Cart
            <span className="ml-3 text-lg font-semibold text-zinc-500">({items.length} items)</span>
          </h1>
        </motion.div>

        {items.length === 0 && savedItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left — Cart Items */}
            <div className="flex-1 space-y-4">
              <FreeShippingBar subtotal={subtotal} />

              <AnimatePresence>
                {items.map((item) => (
                  <CartItem key={item.id} item={item}
                    onQtyChange={handleQtyChange}
                    onRemove={handleRemove}
                    onSaveLater={handleSaveLater}
                  />
                ))}
              </AnimatePresence>

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-['Syne'] text-lg font-bold text-white mb-4">Saved for Later ({savedItems.length})</h3>
                  <div className="space-y-3">
                    {savedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950">
                        <div className="w-16 h-16 rounded-xl bg-zinc-900 flex items-center justify-center text-3xl">{item.img}</div>
                        <div className="flex-1">
                          <p className="text-[13px] font-semibold text-white">{item.name}</p>
                          <p className="text-sm font-bold text-white mt-1">₹{item.price.toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleMoveToCart(item.id)}
                          className="text-[12px] font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-3 py-1.5 rounded-lg hover:bg-cyan-400/10 transition-all">
                          Move to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — Summary */}
            <div className="w-full lg:w-96 lg:sticky lg:top-24 h-fit space-y-4">

              {/* Coupon */}
              <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950">
                <h3 className="font-['Syne'] text-sm font-bold text-white uppercase tracking-wider mb-3">Apply Coupon</h3>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="Enter coupon code"
                    className="flex-1 h-10 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-cyan-400/50"
                  />
                  <button onClick={handleApplyCoupon}
                    className="px-4 h-10 rounded-xl bg-cyan-400 text-black text-sm font-bold hover:bg-cyan-300 transition-colors">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[12px] text-red-400 mt-2">{couponError}</p>}
                {couponSuccess && <p className="text-[12px] text-green-400 mt-2">✓ {couponSuccess}</p>}
                <p className="text-[11px] text-zinc-600 mt-2">Try: CROMA10, SAVE20, FIRST15</p>
              </div>

              {/* Price Summary */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950">
                <h3 className="font-['Syne'] text-sm font-bold text-white uppercase tracking-wider mb-4">Price Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Price ({items.length} items)</span>
                    <span className="text-white">₹{originalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>− ₹{itemDiscount.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span>− ₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? "text-green-400" : "text-white"}>
                      {delivery === 0 ? "FREE" : `₹${delivery}`}
                    </span>
                  </div>
                  <div className="border-t border-zinc-800 pt-3 flex justify-between">
                    <span className="font-bold text-white text-base">Total</span>
                    <span className="font-black text-white text-lg">₹{total.toLocaleString()}</span>
                  </div>
                  {(itemDiscount + couponDiscount) > 0 && (
                    <p className="text-[12px] text-green-400 font-semibold bg-green-400/10 rounded-lg px-3 py-2 text-center">
                      🎉 You save ₹{(itemDiscount + couponDiscount).toLocaleString()} on this order!
                    </p>
                  )}
                </div>

                {/* Estimated delivery */}
                <div className="mt-4 flex items-center gap-2 text-[12px] text-zinc-400 bg-zinc-900 rounded-xl p-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span>Estimated delivery: <span className="text-white font-semibold">2-4 business days</span></span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 h-12 rounded-xl bg-cyan-400 text-black font-bold text-sm hover:bg-cyan-300 transition-colors"
                  disabled={items.length === 0}
                >
                  Proceed to Checkout →
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="w-full mt-3 h-11 rounded-xl border border-zinc-700 text-zinc-300 font-semibold text-sm hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  ← Continue Shopping
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}