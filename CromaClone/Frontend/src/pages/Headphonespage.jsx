import { useRef } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FeaturedCard, DealCard } from "../components/ProductCard";

const featuredProducts = [
  { id: 1, name: "Sony WH-1000XM5", price: 29999, originalPrice: 34999, rating: 4.8, reviews: 2341, badge: "Best Seller", badgeColor: "#00e5ff", img: "🎧" },
  { id: 101, name: "Apple AirPods Max", price: 59900, originalPrice: 64900, rating: 4.7, reviews: 1892, badge: "Premium", badgeColor: "#a855f7", img: "🎧" },
  { id: 102, name: "Bose QuietComfort 45", price: 24999, originalPrice: 32000, rating: 4.6, reviews: 1543, badge: "Top Rated", badgeColor: "#22c55e", img: "🎧" },
  { id: 103, name: "JBL Tour One M2", price: 19999, originalPrice: 24999, rating: 4.5, reviews: 987, badge: "Trending", badgeColor: "#f59e0b", img: "🎧" },
  { id: 104, name: "Sennheiser HD 450BT", price: 9999, originalPrice: 14999, rating: 4.4, reviews: 763, badge: "Value Pick", badgeColor: "#3b82f6", img: "🎧" },
  { id: 105, name: "Boat Rockerz 550", price: 1799, originalPrice: 3990, rating: 4.2, reviews: 45231, badge: "Popular", badgeColor: "#ef4444", img: "🎧" },
];

const dealProducts = [
  { id: 106, name: "Sony WH-CH720N", price: 8999, originalPrice: 14999, discount: 40, rating: 4.3, reviews: 3201, img: "🎧" },
  { id: 107, name: "JBL Live 770NC", price: 11999, originalPrice: 19999, discount: 40, rating: 4.4, reviews: 2109, img: "🎧" },
  { id: 108, name: "Noise One ANC", price: 2999, originalPrice: 5999, discount: 50, rating: 4.1, reviews: 12043, img: "🎧" },
  { id: 109, name: "Boat Rockerz 450", price: 999, originalPrice: 2990, discount: 67, rating: 4.0, reviews: 89234, img: "🎧" },
  { id: 110, name: "Skullcandy Crusher ANC 2", price: 14999, originalPrice: 24999, discount: 40, rating: 4.5, reviews: 876, img: "🎧" },
  { id: 111, name: "OnePlus Clouds", price: 4999, originalPrice: 8999, discount: 44, rating: 4.2, reviews: 5432, img: "🎧" },
];

const brands = ["All", "boAt", "Sony", "Apple", "JBL", "Noise", "Bose", "Sennheiser", "Skullcandy", "OnePlus"];

function HSlider({ children, title, subtitle, accentColor = "#00e5ff" }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  return (
    <div className="mb-14">
      <div className="flex items-end justify-between mb-5 px-4 md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2.5px] mb-1" style={{ color: accentColor }}>{subtitle}</p>
          <h2 className="font-['Syne'] text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <button className="ml-1 text-[12px] font-semibold px-4 h-9 rounded-full border transition-all hover:-translate-y-0.5"
            style={{ borderColor: `${accentColor}40`, color: accentColor, background: `${accentColor}10` }}>
            View All →
          </button>
        </div>
      </div>
      <div className="relative overflow-y-visible">
        <div ref={ref} className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-4 pt-4" style={{ scrollbarWidth: "none" }}>
          {children}
        </div>
        <div className="absolute right-0 top-0 bottom-2 w-16 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }} />
      </div>
    </div>
  );
}

function BrandsSection() {
  const [active, setActive] = useState("All");
  return (
    <div className="px-4 md:px-8 mb-14">
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[2.5px] text-zinc-500 mb-1">Filter by</p>
        <h2 className="font-['Syne'] text-2xl font-bold text-white">Shop by Brand</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {brands.map((brand) => (
          <button key={brand} onClick={() => setActive(brand)}
            className={`h-10 px-5 rounded-full border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5
              ${active === brand ? "bg-white text-black border-white" : "bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"}`}>
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HeadphonesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-10 pb-20">
      <motion.div
        className="px-4 md:px-8 mb-12 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[3px] text-cyan-400 mb-3">Category</p>
        <h1 className="font-['Syne'] text-5xl font-black text-white mb-3">Headphones</h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto">Explore top-quality headphones from leading brands</p>
        <div className="mt-6 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
      </motion.div>

      <HSlider title="Featured Headphones" subtitle="Top Picks" accentColor="#00e5ff">
        {featuredProducts.map((p) => <FeaturedCard key={p.id} p={p} />)}
      </HSlider>

      <HSlider title="Best Deals & Offers" subtitle="Limited Time" accentColor="#f97316">
        {dealProducts.map((p) => <DealCard key={p.id} p={p} />)}
      </HSlider>

      <BrandsSection />
    </div>
  );
}