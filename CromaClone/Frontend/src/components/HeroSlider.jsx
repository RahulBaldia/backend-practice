import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { tag: "New Launch ✦ 2025", line1: "Sound That", line2: "Moves You", desc: "Noise-cancelling headphones, 40hr battery.", btn: "Shop Now →", btn2: "Explore All", accent: "#00e5ff", glow: "radial-gradient(ellipse at 30% 50%, rgba(0,229,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(123,47,255,0.08) 0%, transparent 60%)" },
  { tag: "Best Sellers ✦ 2025", line1: "Power Meets", line2: "Portability", desc: "AI-powered laptops, ultra-thin design.", btn: "View Laptops →", btn2: "Compare Now", accent: "#3b82f6", glow: "radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(0,229,255,0.06) 0%, transparent 60%)" },
  { tag: "Trending ✦ 2025", line1: "Smart Homes", line2: "Start Here", desc: "Smart ACs, fridges and more for your home.", btn: "Explore Now →", btn2: "Browse All", accent: "#f59e0b", glow: "radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.10) 0%, transparent 60%), radial-gradient(ellipse at 50% 70%, rgba(0,229,255,0.06) 0%, transparent 60%)" },
  { tag: "Hot Deals ✦ 2025", line1: "Smartphones", line2: "Redefined", desc: "Flagship phones, pro cameras, all-day battery.", btn: "Buy Now →", btn2: "See All Phones", accent: "#22c55e", glow: "radial-gradient(ellipse at 40% 50%, rgba(34,197,94,0.12) 0%, transparent 60%), radial-gradient(ellipse at 60% 50%, rgba(0,229,255,0.06) 0%, transparent 60%)" },
  { tag: "Premium Audio ✦ 2025", line1: "Bass That", line2: "Hits Different", desc: "360° surround sound, crystal-clear audio.", btn: "Shop Speakers →", btn2: "Listen Now", accent: "#ef4444", glow: "radial-gradient(ellipse at 60% 50%, rgba(239,68,68,0.12) 0%, transparent 60%), radial-gradient(ellipse at 40% 50%, rgba(123,47,255,0.08) 0%, transparent 60%)" },
];

const slideVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const itemVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0 },
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const goTo = (n) => setCurrent((n + slides.length) % slides.length);
  const slide = slides[current];

  return (
    <section className="relative h-[480px] overflow-hidden bg-[#0a0a0a]">
      {/* Animated glow bg */}
      <motion.div
        key={current + "-bg"}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ background: slide.glow }}
      />

      {/* Animated content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 flex items-center justify-center"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <div className="relative z-10 flex flex-col items-center text-center w-full max-w-xl mx-auto px-6">

            {/* Tag */}
            <motion.div variants={itemVariants} className="h-9 flex items-center justify-center mb-5">
              <span className="inline-block rounded-full border px-5 py-1.5 text-[13px] font-semibold tracking-wide whitespace-nowrap"
                style={{ borderColor: `${slide.accent}50`, background: `${slide.accent}15`, color: slide.accent }}>
                {slide.tag}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="h-[130px] flex flex-col items-center justify-center mb-4">
              <h1 className="font-['Syne'] text-5xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 whitespace-nowrap">
                {slide.line1}
              </h1>
              <h1 className="font-['Syne'] text-5xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 whitespace-nowrap">
                {slide.line2}
              </h1>
            </motion.div>

            {/* Desc */}
            <motion.div variants={itemVariants} className="h-8 flex items-center justify-center mb-8">
              <p className="text-zinc-400 text-[15px] whitespace-nowrap">{slide.desc}</p>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-48 rounded-xl text-[15px] font-bold text-black flex items-center justify-center whitespace-nowrap px-8 py-3"
                style={{ background: slide.accent }}
              >
                {slide.btn}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-48 rounded-xl border border-zinc-700 bg-transparent text-[15px] font-semibold text-white flex items-center justify-center whitespace-nowrap px-8 py-3 hover:bg-zinc-800"
              >
                {slide.btn2}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => goTo(current - 1)}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-md hover:bg-white/10 hover:text-white transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
      </motion.button>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => goTo(current + 1)}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 backdrop-blur-md hover:bg-white/10 hover:text-white transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
      </motion.button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <motion.button key={i} onClick={() => setCurrent(i)}
            animate={{ width: i === current ? 24 : 6, background: i === current ? s.accent : "rgba(255,255,255,0.2)" }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full"
          />
        ))}
      </div>
    </section>
  );
}