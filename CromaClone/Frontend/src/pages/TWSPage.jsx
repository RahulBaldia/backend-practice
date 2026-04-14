import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FeaturedCard, DealCard } from "../components/ProductCard";

const featuredProducts = [
  { id: 1, name: "Apple AirPods Pro 2nd Gen", price: 24900, originalPrice: 26900, rating: 4.8, reviews: 18432, badge: "Best Seller", badgeColor: "#00e5ff", specs: ["ANC", "30hr Battery", "BT 5.3"], img: "🎵" },
  { id: 2, name: "Sony WF-1000XM5", price: 19990, originalPrice: 23990, rating: 4.7, reviews: 9821, badge: "Premium", badgeColor: "#a855f7", specs: ["ANC", "24hr Battery", "BT 5.3"], img: "🎵" },
  { id: 3, name: "Samsung Galaxy Buds3 Pro", price: 17999, originalPrice: 21999, rating: 4.6, reviews: 7654, badge: "Top Rated", badgeColor: "#22c55e", specs: ["ANC", "30hr Battery", "BT 5.4"], img: "🎵" },
  { id: 4, name: "OnePlus Buds 3 Pro", price: 9999, originalPrice: 13999, rating: 4.5, reviews: 5432, badge: "Trending", badgeColor: "#f59e0b", specs: ["ANC", "44hr Battery", "BT 5.4"], img: "🎵" },
  { id: 5, name: "Noise Buds VS104", price: 1299, originalPrice: 2999, rating: 4.2, reviews: 34521, badge: "Value Pick", badgeColor: "#3b82f6", specs: ["ENC", "50hr Battery", "BT 5.3"], img: "🎵" },
  { id: 6, name: "boAt Airdopes 141", price: 999, originalPrice: 2990, rating: 4.1, reviews: 120432, badge: "Popular", badgeColor: "#ef4444", specs: ["ENC", "42hr Battery", "BT 5.0"], img: "🎵" },
];

const dealProducts = [
  { id: 7, name: "Realme Buds Air 5 Pro", price: 3999, originalPrice: 7999, discount: 50, rating: 4.3, reviews: 12045, specs: ["ANC", "38hr Battery", "BT 5.3"], img: "🎵" },
  { id: 8, name: "boAt Airdopes 181", price: 1299, originalPrice: 3990, discount: 67, rating: 4.2, reviews: 87654, specs: ["ENC", "50hr Battery", "BT 5.3"], img: "🎵" },
  { id: 9, name: "Noise Buds Connect 2", price: 1799, originalPrice: 3999, discount: 55, rating: 4.0, reviews: 23421, specs: ["ENC", "60hr Battery", "BT 5.3"], img: "🎵" },
  { id: 10, name: "OnePlus Nord Buds 2r", price: 2499, originalPrice: 4999, discount: 50, rating: 4.3, reviews: 9832, specs: ["ENC", "38hr Battery", "BT 5.3"], img: "🎵" },
  { id: 11, name: "Sony WF-C700N", price: 8990, originalPrice: 13990, discount: 36, rating: 4.5, reviews: 4321, specs: ["ANC", "15hr Battery", "BT 5.0"], img: "🎵" },
  { id: 12, name: "Realme Buds T110", price: 999, originalPrice: 1999, discount: 50, rating: 4.0, reviews: 43210, specs: ["ENC", "38hr Battery", "BT 5.3"], img: "🎵" },
];

const brands = ["All", "boAt", "Noise", "Realme", "OnePlus", "Apple", "Sony", "Samsung", "JBL"];





function HSlider({ children, title, subtitle, accentColor = "#a855f7" }) {
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
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-600">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white hover:border-zinc-600">
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

export default function TWSPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-10 pb-20">

      <motion.div
        className="px-4 md:px-8 mb-12 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[3px] text-purple-400 mb-3">Category</p>
        <h1 className="font-['Syne'] text-5xl font-black text-white mb-3">TWS Earbuds</h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto">Experience true wireless freedom with top-quality earbuds</p>
        <div className="mt-6 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
      </motion.div>

      <HSlider title="Featured Earbuds" subtitle="Top Picks" accentColor="#a855f7">
        {featuredProducts.map((p) => <FeaturedCard key={p.id} p={p} />)}
      </HSlider>

      <HSlider title="Best Deals & Offers" subtitle="Limited Time" accentColor="#f97316">
        {dealProducts.map((p) => <DealCard key={p.id} p={p} />)}
      </HSlider>

      <BrandsSection />

    </div>
  );
}