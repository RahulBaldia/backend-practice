import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FeaturedCard, DealCard } from "../components/ProductCard";

const featuredProducts = [
  { id: 1, name: "LG 1.5 Ton 5 Star AI DUAL Inverter AC", price: 42990, originalPrice: 54990, rating: 4.7, reviews: 12432, badge: "Best Seller", badgeColor: "#00e5ff", specs: ["5 Star", "1.5 Ton", "Wi-Fi", "Auto Clean"], img: "❄️" },
  { id: 2, name: "Samsung 253L Double Door Refrigerator", price: 27990, originalPrice: 35990, rating: 4.6, reviews: 9821, badge: "Top Rated", badgeColor: "#22c55e", specs: ["253L", "3 Star", "Frost Free", "Digital Inverter"], img: "🧊" },
  { id: 3, name: "IFB 8kg Front Load Washing Machine", price: 34990, originalPrice: 44990, rating: 4.7, reviews: 7654, badge: "Premium", badgeColor: "#a855f7", specs: ["8kg", "5 Star", "Steam Wash", "1400 RPM"], img: "🫧" },
  { id: 4, name: "Dyson V15 Detect Vacuum", price: 52900, originalPrice: 62900, rating: 4.8, reviews: 5432, badge: "Trending", badgeColor: "#f59e0b", specs: ["Cordless", "60min", "HEPA Filter", "LCD Display"], img: "🌀" },
  { id: 5, name: "Whirlpool 24L Convection Microwave", price: 11990, originalPrice: 16990, rating: 4.4, reviews: 18762, badge: "Value Pick", badgeColor: "#3b82f6", specs: ["24L", "Convection", "Auto Cook", "Steam Clean"], img: "📡" },
  { id: 6, name: "Haier 320L French Door Fridge", price: 49990, originalPrice: 64990, rating: 4.5, reviews: 3421, badge: "Popular", badgeColor: "#ef4444", specs: ["320L", "3 Star", "Frost Free", "Twin Inverter"], img: "🧊" },
];

const dealProducts = [
  { id: 7, name: "Voltas 1 Ton 3 Star Window AC", price: 27990, originalPrice: 38990, discount: 28, rating: 4.2, reviews: 23421, specs: ["1 Ton", "3 Star", "Turbo Cool", "Auto Restart"], img: "❄️" },
  { id: 8, name: "Samsung 7kg Top Load Washer", price: 19990, originalPrice: 27990, discount: 29, rating: 4.3, reviews: 34521, specs: ["7kg", "5 Star", "Wobble Tech", "700 RPM"], img: "🫧" },
  { id: 9, name: "LG 190L Single Door Fridge", price: 13990, originalPrice: 19990, discount: 30, rating: 4.1, reviews: 45321, specs: ["190L", "4 Star", "Smart Inverter", "Moist Balance"], img: "🧊" },
  { id: 10, name: "Bajaj 1500W Room Heater", price: 2490, originalPrice: 3990, discount: 38, rating: 4.0, reviews: 67432, specs: ["1500W", "2 Settings", "Overheat Protection", "Portable"], img: "🔥" },
  { id: 11, name: "Philips Air Purifier AC1215", price: 8990, originalPrice: 12990, discount: 31, rating: 4.4, reviews: 12043, specs: ["HEPA", "333 sq.ft", "99.97% Clean", "Auto Mode"], img: "💨" },
  { id: 12, name: "IFB 20L Solo Microwave", price: 6490, originalPrice: 9490, discount: 32, rating: 4.2, reviews: 28764, specs: ["20L", "Solo", "700W", "Child Lock"], img: "📡" },
];

const brands = ["All", "LG", "Samsung", "Whirlpool", "IFB", "Haier", "Voltas", "Dyson", "Philips"];
const accentColor = "#f59e0b";



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

export default function HomeAppliancesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-10 pb-20">
      <motion.div className="px-4 md:px-8 mb-12 text-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}>
        <p className="text-[11px] font-semibold uppercase tracking-[3px] mb-3" style={{ color: accentColor }}>Category</p>
        <h1 className="font-['Syne'] text-5xl font-black text-white mb-3">Home Appliances</h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto">Upgrade your home with smart and efficient appliances</p>
        <div className="mt-6 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
      </motion.div>
      <HSlider title="Featured Appliances" subtitle="Top Picks" accent={accentColor}>
        {featuredProducts.map((p) => <FeaturedCard key={p.id} p={p} />)}
      </HSlider>
      <HSlider title="Best Deals & Offers" subtitle="Limited Time" accent="#f97316">
        {dealProducts.map((p) => <DealCard key={p.id} p={p} />)}
      </HSlider>
      <BrandsSection />
    </div>
  );
}