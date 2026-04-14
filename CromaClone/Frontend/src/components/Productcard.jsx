import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function SpecPill({ label }) {
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
      {label}
    </span>
  );
}

// ─── SKELETON CARD ───────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-64 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden animate-pulse">
      <div className="h-48 bg-zinc-900" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-800 rounded-lg w-3/4" />
        <div className="h-3 bg-zinc-800 rounded-lg w-1/2" />
        <div className="h-5 bg-zinc-800 rounded-lg w-1/3" />
        <div className="h-9 bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

// ─── FEATURED CARD ────────────────────────────────────────────────────────────
export function FeaturedCard({ p }) {
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const [cartAnim, setCartAnim] = useState(false);
  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

  const handleCardClick = (e) => {
    // Prevent navigation if clicking wishlist or cart button
    if (e.target.closest("button")) return;
    navigate(`/product/${p.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="group relative flex-shrink-0 w-64 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden cursor-pointer hover:border-zinc-600 hover:shadow-2xl transition-all duration-300"
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: `${p.badgeColor}20`, color: p.badgeColor, border: `1px solid ${p.badgeColor}40` }}>
          {p.badge}
        </span>
      </div>

      {/* Wishlist */}
      <button onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center transition-all hover:border-red-400">
        <svg width="13" height="13" viewBox="0 0 24 24"
          fill={wished ? "#ef4444" : "none"} stroke={wished ? "#ef4444" : "#71717a"} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Image */}
      <div className="h-48 flex items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 text-7xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle at 50% 50%, ${p.badgeColor}15, transparent 70%)` }} />
        <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{p.img}</span>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[15px] font-semibold text-white leading-snug mb-2 line-clamp-2 min-h-[44px]">{p.name}</p>
        {p.specs && <div className="flex flex-wrap gap-1 mb-2">{p.specs.map((s) => <SpecPill key={s} label={s} />)}</div>}
        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={p.rating} />
          <span className="text-[12px] text-zinc-500">({p.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-white">₹{p.price.toLocaleString()}</span>
          <span className="text-[13px] text-zinc-600 line-through">₹{p.originalPrice.toLocaleString()}</span>
          <span className="text-[13px] text-green-400 font-semibold">{discount}% off</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setCartAnim(true); setTimeout(() => setCartAnim(false), 600); }}
          className={`w-full h-10 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5
            ${cartAnim ? "bg-green-500 text-white scale-95" : "bg-zinc-900 border border-zinc-700 text-zinc-300 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-white"}`}>
          {cartAnim
            ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> Added!</>
            : "Add to Cart"}
        </button>
      </div>

      {/* View Details overlay on hover */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

// ─── DEAL CARD ────────────────────────────────────────────────────────────────
export function DealCard({ p }) {
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const [cartAnim, setCartAnim] = useState(false);

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    navigate(`/product/${p.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="group relative flex-shrink-0 w-64 rounded-2xl border border-zinc-800 bg-[#0f0f0f] overflow-hidden cursor-pointer hover:border-orange-500/40 hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute top-3 left-3 z-10">
        <span className="text-[12px] font-black px-3 py-1 rounded-full bg-orange-500 text-white">{p.discount}% OFF</span>
      </div>
      <button onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center transition-all hover:border-red-400">
        <svg width="13" height="13" viewBox="0 0 24 24"
          fill={wished ? "#ef4444" : "none"} stroke={wished ? "#ef4444" : "#71717a"} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      <div className="h-48 flex items-center justify-center bg-gradient-to-b from-orange-950/20 to-zinc-950 text-7xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(249,115,22,0.12), transparent 70%)" }} />
        <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{p.img}</span>
      </div>
      <div className="p-4">
        <p className="text-[15px] font-semibold text-white leading-snug mb-2 line-clamp-2 min-h-[44px]">{p.name}</p>
        {p.specs && <div className="flex flex-wrap gap-1 mb-2">{p.specs.map((s) => <SpecPill key={s} label={s} />)}</div>}
        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={p.rating} />
          <span className="text-[12px] text-zinc-500">({p.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-orange-400">₹{p.price.toLocaleString()}</span>
          <span className="text-[13px] text-zinc-600 line-through">₹{p.originalPrice.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-[13px] text-green-400 font-medium">Save ₹{(p.originalPrice - p.price).toLocaleString()}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setCartAnim(true); setTimeout(() => setCartAnim(false), 600); }}
          className={`w-full h-10 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5
            ${cartAnim ? "bg-green-500 text-white scale-95" : "bg-orange-500/10 border border-orange-500/30 text-orange-400 opacity-0 group-hover:opacity-100 hover:bg-orange-500 hover:text-white"}`}>
          {cartAnim
            ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> Added!</>
            : "Grab Deal →"}
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}