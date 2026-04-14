import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: "🎧", name: "Headphones", path: "/headphones" },
  { icon: "🎵", name: "TWS Earbuds", path: "/tws" },
  { icon: "💻", name: "Laptops", path: "/laptops" },
  { icon: "📱", name: "Smartphones", path: "/smartphones" },
  { icon: "🏠", name: "Home Appliances", path: "/appliances" },
  { icon: "🔊", name: "Speakers", path: "/speakers" },
];

const allProducts = [
  "Sony WH-1000XM5 Headphones",
  "Apple AirPods Pro",
  "Samsung Galaxy S24",
  "MacBook Air M3",
  "OnePlus Buds 3",
  "LG 55\" OLED TV",
  "Dyson V15 Vacuum",
  "Samsung Side-by-Side Fridge",
  "Dell XPS 15 Laptop",
  "Boat Rockerz 550",
  "Pixel 8 Pro Smartphone",
  "Voltas 1.5 Ton AC",
  "JBL Flip 6 Speaker",
  "Bose QuietComfort 45",
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (val) => {
    setQuery(val);
    if (!val.trim()) { setSuggestions([]); setShowSug(false); return; }
    const filtered = allProducts.filter((p) =>
      p.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 6);
    setSuggestions(filtered);
    setShowSug(filtered.length > 0);
  };

  const getCategory = (name) => {
    if (name.includes("Headphone") || name.includes("Buds") || name.includes("AirPods")) return "Audio";
    if (name.includes("Laptop") || name.includes("MacBook") || name.includes("Dell")) return "Laptops";
    if (name.includes("Phone") || name.includes("Galaxy") || name.includes("Pixel")) return "Phones";
    return "Electronics";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">

        {/* Logo */}
        <span
          onClick={() => navigate("/")}
          className="font-['Syne'] text-2xl font-black tracking-tight bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent cursor-pointer select-none">
          Croma
        </span>

        {/* Hamburger Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-zinc-700 bg-zinc-900 transition-all hover:bg-zinc-800"
          >
            <span className={`block h-[1.5px] w-4 rounded bg-white transition-all duration-300 ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-4 rounded bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-4 rounded bg-white transition-all duration-300 ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>

          {/* Dropdown */}
          <div className={`absolute left-0 top-[calc(100%+12px)] w-56 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0 pointer-events-auto scale-100" : "opacity-0 -translate-y-2 pointer-events-none scale-95"}`}>
            <p className="px-4 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[2px] text-zinc-500">
              Categories
            </p>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { navigate(cat.path); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 border-l-2 border-transparent px-4 py-2.5 text-sm text-zinc-400 transition-all hover:border-cyan-400 hover:bg-zinc-900 hover:text-white"
              >
                <span className="w-5 text-center text-base">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
            <div className="pb-2" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mx-auto flex-1 max-w-lg">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowSug(false), 200)}
            onFocus={() => query && setShowSug(suggestions.length > 0)}
            placeholder="Search products, brands and more..."
            className="h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-zinc-500 focus:bg-zinc-800"
          />

          {/* Suggestions Dropdown */}
          {showSug && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
              {suggestions.map((item) => (
                <div
                  key={item}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white"
                  onMouseDown={() => { setQuery(item); setShowSug(false); }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-zinc-600">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <span dangerouslySetInnerHTML={{
                    __html: item.replace(new RegExp(`(${query})`, "gi"), '<strong class="text-white">$1</strong>')
                  }} />
                  <span className="ml-auto text-[11px] text-zinc-600">{getCategory(item)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Account */}
          <button onClick={() => navigate("/login")} className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          {/* Cart */}
          <button onClick={() => navigate("/cart")} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-bold text-black">3</span>
          </button>
        </div>
      </div>
    </nav>
  );
}