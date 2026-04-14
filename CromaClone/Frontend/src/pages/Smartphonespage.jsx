import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FeaturedCard, DealCard } from "../components/ProductCard";

const featuredProducts = [
  { id: 1, name: "iPhone 15 Pro Max", price: 134900, originalPrice: 159900, rating: 4.9, reviews: 23421, badge: "Best Seller", badgeColor: "#00e5ff", specs: ["256GB", "48MP", "4422mAh", "A17 Pro"], img: "📱" },
  { id: 2, name: "Samsung Galaxy S24 Ultra", price: 129999, originalPrice: 149999, rating: 4.8, reviews: 18932, badge: "Premium", badgeColor: "#a855f7", specs: ["12GB RAM", "200MP", "5000mAh", "Snapdragon 8 Gen 3"], img: "📱" },
  { id: 3, name: "OnePlus 12", price: 64999, originalPrice: 74999, rating: 4.7, reviews: 12043, badge: "Top Rated", badgeColor: "#22c55e", specs: ["16GB RAM", "50MP", "5400mAh", "Snapdragon 8 Gen 3"], img: "📱" },
  { id: 4, name: "Xiaomi 14 Ultra", price: 99999, originalPrice: 114999, rating: 4.6, reviews: 8765, badge: "Trending", badgeColor: "#f59e0b", specs: ["16GB RAM", "50MP", "5000mAh", "Snapdragon 8 Gen 3"], img: "📱" },
  { id: 5, name: "Realme GT 6", price: 34999, originalPrice: 44999, rating: 4.4, reviews: 9832, badge: "Value Pick", badgeColor: "#3b82f6", specs: ["12GB RAM", "50MP", "5500mAh", "Snapdragon 8s Gen 3"], img: "📱" },
  { id: 6, name: "Samsung Galaxy A55", price: 34999, originalPrice: 40999, rating: 4.3, reviews: 34210, badge: "Popular", badgeColor: "#ef4444", specs: ["8GB RAM", "50MP", "5000mAh", "Exynos 1480"], img: "📱" },
];

const dealProducts = [
  { id: 7, name: "iPhone 14", price: 64900, originalPrice: 79900, discount: 19, rating: 4.7, reviews: 45321, specs: ["128GB", "12MP", "3279mAh", "A15 Bionic"], img: "📱" },
  { id: 8, name: "OnePlus Nord CE 4", price: 24999, originalPrice: 34999, discount: 29, rating: 4.4, reviews: 12043, specs: ["8GB RAM", "50MP", "5500mAh", "Snapdragon 7s Gen 2"], img: "📱" },
  { id: 9, name: "Xiaomi Redmi Note 13 Pro", price: 22999, originalPrice: 32999, discount: 30, rating: 4.3, reviews: 54321, specs: ["8GB RAM", "200MP", "5100mAh", "Snapdragon 7s Gen 2"], img: "📱" },
  { id: 10, name: "Realme Narzo 70 Pro", price: 18999, originalPrice: 26999, discount: 30, rating: 4.2, reviews: 23421, specs: ["8GB RAM", "50MP", "5000mAh", "Dimensity 7050"], img: "📱" },
  { id: 11, name: "Samsung Galaxy M55", price: 27999, originalPrice: 36999, discount: 24, rating: 4.3, reviews: 8762, specs: ["8GB RAM", "50MP", "6000mAh", "Snapdragon 7 Gen 1"], img: "📱" },
  { id: 12, name: "Xiaomi Poco X6 Pro", price: 26999, originalPrice: 36999, discount: 27, rating: 4.5, reviews: 19832, specs: ["12GB RAM", "64MP", "5000mAh", "Dimensity 8300"], img: "📱" },
];

const brands = ["All", "Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "iQOO", "Motorola", "Nothing"];
const accentColor = "#22c55e";



function HSlider({ children, title, subtitle, accent }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  return (
    <div className="mb-14">
      <div className="flex items-end justify-between mb-5 px-4 md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[2.5px] mb-1" style={{ color: accent }}>{subtitle}</p>
          <h2 className="font-['Syne'] text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <button className="ml-1 text-[12px] font-semibold px-4 h-9 rounded-full border transition-all hover:-translate-y-0.5" style={{ borderColor: `${accent}40`, color: accent, background: `${accent}10` }}>View All →</button>
        </div>
      </div>
      <div className="relative overflow-y-visible">
        <div ref={ref} className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-4 pt-4" style={{ scrollbarWidth: "none" }}>{children}</div>
        <div className="absolute right-0 top-0 bottom-2 w-16 pointer-events-none" style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }} />
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
        {brands.map((b) => (
          <button key={b} onClick={() => setActive(b)}
            className={`h-10 px-5 rounded-full border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${active === b ? "bg-white text-black border-white" : "bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"}`}>
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SmartphonesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-10 pb-20">
      <motion.div className="px-4 md:px-8 mb-12 text-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}>
        <p className="text-[11px] font-semibold uppercase tracking-[3px] mb-3" style={{ color: accentColor }}>Category</p>
        <h1 className="font-['Syne'] text-5xl font-black text-white mb-3">Smartphones</h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto">Discover the latest smartphones with powerful performance and features</p>
        <div className="mt-6 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-green-400 to-cyan-400" />
      </motion.div>
      <HSlider title="Featured Smartphones" subtitle="Top Picks" accent={accentColor}>
        {featuredProducts.map((p) => <FeaturedCard key={p.id} p={p} />)}
      </HSlider>
      <HSlider title="Best Deals & Offers" subtitle="Limited Time" accent="#f97316">
        {dealProducts.map((p) => <DealCard key={p.id} p={p} />)}
      </HSlider>
      <BrandsSection />
    </div>
  );
}