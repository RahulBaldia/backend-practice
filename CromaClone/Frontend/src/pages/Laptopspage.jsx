import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FeaturedCard, DealCard } from "../components/ProductCard";

const featuredProducts = [
  { id: 1, name: "MacBook Pro 14\" M3 Pro", price: 198900, originalPrice: 219900, rating: 4.9, reviews: 12432, badge: "Best Seller", badgeColor: "#00e5ff", specs: ["M3 Pro", "18GB RAM", "512GB SSD", "18hr Battery"], img: "💻" },
  { id: 2, name: "Dell XPS 15 OLED", price: 169990, originalPrice: 199990, rating: 4.8, reviews: 8932, badge: "Premium", badgeColor: "#a855f7", specs: ["i9-13900H", "32GB RAM", "1TB SSD", "RTX 4070"], img: "💻" },
  { id: 3, name: "ASUS ROG Zephyrus G16", price: 149990, originalPrice: 179990, rating: 4.7, reviews: 7654, badge: "Top Rated", badgeColor: "#ef4444", specs: ["Ryzen 9", "16GB RAM", "1TB SSD", "RTX 4080"], img: "💻" },
  { id: 4, name: "HP Spectre x360 14", price: 139990, originalPrice: 159990, rating: 4.6, reviews: 5432, badge: "Trending", badgeColor: "#f59e0b", specs: ["i7-1355U", "16GB RAM", "1TB SSD", "Intel Iris Xe"], img: "💻" },
  { id: 5, name: "Lenovo ThinkPad X1 Carbon", price: 129990, originalPrice: 154990, rating: 4.7, reviews: 6543, badge: "Business Pick", badgeColor: "#22c55e", specs: ["i7-1365U", "16GB RAM", "512GB SSD", "Intel Iris Xe"], img: "💻" },
  { id: 6, name: "MacBook Air M2", price: 99900, originalPrice: 119900, rating: 4.8, reviews: 34210, badge: "Popular", badgeColor: "#3b82f6", specs: ["M2", "8GB RAM", "256GB SSD", "18hr Battery"], img: "💻" },
];

const dealProducts = [
  { id: 7, name: "HP Victus 15 Gaming", price: 59990, originalPrice: 79990, discount: 25, rating: 4.4, reviews: 23421, specs: ["i5-12500H", "8GB RAM", "512GB SSD", "RTX 3050"], img: "💻" },
  { id: 8, name: "Lenovo IdeaPad Slim 5", price: 49990, originalPrice: 67990, discount: 26, rating: 4.3, reviews: 18762, specs: ["Ryzen 5 7530U", "8GB RAM", "512GB SSD", "AMD Radeon"], img: "💻" },
  { id: 9, name: "ASUS VivoBook 15", price: 42990, originalPrice: 58990, discount: 27, rating: 4.2, reviews: 34521, specs: ["i5-1235U", "8GB RAM", "512GB SSD", "Intel Iris Xe"], img: "💻" },
  { id: 10, name: "Dell Inspiron 15 3000", price: 38990, originalPrice: 52990, discount: 26, rating: 4.1, reviews: 45321, specs: ["i3-1215U", "8GB RAM", "256GB SSD", "Intel UHD"], img: "💻" },
  { id: 11, name: "Acer Aspire Lite", price: 34990, originalPrice: 47990, discount: 27, rating: 4.0, reviews: 27654, specs: ["Ryzen 3 5300U", "8GB RAM", "256GB SSD", "AMD Radeon"], img: "💻" },
  { id: 12, name: "HP 14s Laptop", price: 31990, originalPrice: 44990, discount: 29, rating: 4.0, reviews: 54321, specs: ["i3-1215U", "8GB RAM", "512GB SSD", "Intel UHD"], img: "💻" },
];

const brands = ["All", "Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Samsung"];
const accentColor = "#3b82f6";



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

export default function LaptopsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-10 pb-20">
      <motion.div className="px-4 md:px-8 mb-12 text-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}>
        <p className="text-[11px] font-semibold uppercase tracking-[3px] mb-3" style={{ color: accentColor }}>Category</p>
        <h1 className="font-['Syne'] text-5xl font-black text-white mb-3">Laptops</h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto">Powerful laptops for work, gaming, and everyday use</p>
        <div className="mt-6 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
      </motion.div>
      <HSlider title="Featured Laptops" subtitle="Top Picks" accent={accentColor}>
        {featuredProducts.map((p) => <FeaturedCard key={p.id} p={p} />)}
      </HSlider>
      <HSlider title="Best Deals & Offers" subtitle="Limited Time" accent="#f97316">
        {dealProducts.map((p) => <DealCard key={p.id} p={p} />)}
      </HSlider>
      <BrandsSection />
    </div>
  );
}