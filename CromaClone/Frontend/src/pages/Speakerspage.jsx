import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FeaturedCard, DealCard } from "../components/ProductCard";

const featuredProducts = [
  { id: 1, name: "JBL Charge 5", price: 14999, originalPrice: 19999, rating: 4.8, reviews: 23421, badge: "Best Seller", badgeColor: "#00e5ff", specs: ["40W", "20hr Battery", "BT 5.1", "IP67"], img: "🔊" },
  { id: 2, name: "Sony SRS-XB43", price: 16990, originalPrice: 22990, rating: 4.7, reviews: 12043, badge: "Premium", badgeColor: "#a855f7", specs: ["32W", "24hr Battery", "BT 5.0", "IP67"], img: "🔊" },
  { id: 3, name: "Bose SoundLink Max", price: 39900, originalPrice: 46900, rating: 4.9, reviews: 8762, badge: "Top Rated", badgeColor: "#22c55e", specs: ["—W", "20hr Battery", "BT 5.3", "IP67"], img: "🔊" },
  { id: 4, name: "JBL Flip 6", price: 9999, originalPrice: 13999, rating: 4.6, reviews: 45321, badge: "Trending", badgeColor: "#f59e0b", specs: ["30W", "12hr Battery", "BT 5.1", "IP67"], img: "🔊" },
  { id: 5, name: "boAt Stone 1400", price: 3499, originalPrice: 6999, rating: 4.3, reviews: 89432, badge: "Value Pick", badgeColor: "#3b82f6", specs: ["14W", "7hr Battery", "BT 5.0", "IPX5"], img: "🔊" },
  { id: 6, name: "Sony SRS-XE300", price: 12990, originalPrice: 17990, rating: 4.5, reviews: 9832, badge: "Popular", badgeColor: "#ef4444", specs: ["—W", "24hr Battery", "BT 5.2", "IP67"], img: "🔊" },
];

const dealProducts = [
  { id: 7, name: "JBL Go 3", price: 2499, originalPrice: 3999, discount: 38, rating: 4.3, reviews: 67432, specs: ["4.2W", "5hr Battery", "BT 5.1", "IP67"], img: "🔊" },
  { id: 8, name: "boAt Aavante Bar 1000", price: 2999, originalPrice: 5999, discount: 50, rating: 4.2, reviews: 34521, specs: ["60W", "—", "BT 5.0", "—"], img: "🔊" },
  { id: 9, name: "Zebronics Zeb-County", price: 799, originalPrice: 1599, discount: 50, rating: 4.0, reviews: 54321, specs: ["5W", "—", "BT 5.0", "—"], img: "🔊" },
  { id: 10, name: "Sony SRS-XB13", price: 3990, originalPrice: 5990, discount: 33, rating: 4.4, reviews: 23421, specs: ["—W", "16hr Battery", "BT 5.0", "IP67"], img: "🔊" },
  { id: 11, name: "JBL PartyBox 110", price: 22999, originalPrice: 32999, discount: 30, rating: 4.6, reviews: 8762, specs: ["160W", "12hr Battery", "BT 5.1", "IPX4"], img: "🔊" },
  { id: 12, name: "Bose SoundLink Flex", price: 11900, originalPrice: 16900, discount: 30, rating: 4.7, reviews: 12043, specs: ["—W", "12hr Battery", "BT 5.3", "IP67"], img: "🔊" },
];

const brands = ["All", "JBL", "Sony", "boAt", "Bose", "Zebronics", "Marshall", "Harman", "Anker"];
const accentColor = "#ef4444";



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
          <button className="ml-1 text-[12px] font-semibold px-4 h-9 rounded-full border transition-all hover:-translate-y-0.5"
            style={{ borderColor: `${accent}40`, color: accent, background: `${accent}10` }}>
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
        {brands.map((b) => (
          <button key={b} onClick={() => setActive(b)}
            className={`h-10 px-5 rounded-full border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5
              ${active === b ? "bg-white text-black border-white" : "bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"}`}>
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SpeakersPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-10 pb-20">
      <motion.div className="px-4 md:px-8 mb-12 text-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}>
        <p className="text-[11px] font-semibold uppercase tracking-[3px] mb-3" style={{ color: accentColor }}>Category</p>
        <h1 className="font-['Syne'] text-5xl font-black text-white mb-3">Speakers</h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto">Experience powerful sound with high-quality speakers</p>
        <div className="mt-6 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400" />
      </motion.div>
      <HSlider title="Featured Speakers" subtitle="Top Picks" accent={accentColor}>
        {featuredProducts.map((p) => <FeaturedCard key={p.id} p={p} />)}
      </HSlider>
      <HSlider title="Best Deals & Offers" subtitle="Limited Time" accent="#f97316">
        {dealProducts.map((p) => <DealCard key={p.id} p={p} />)}
      </HSlider>
      <BrandsSection />
    </div>
  );
}