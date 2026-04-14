import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSlider from "./components/HeroSlider";
import Categories from "./components/Categories";
import HeadphonesPage from "./pages/HeadphonesPage";
import TWSPage from "./pages/TWSPage";
import SmartphonesPage from "./pages/SmartphonesPage";
import LaptopsPage from "./pages/LaptopsPage";
import HomeAppliancesPage from "./pages/HomeAppliancesPage";
import SpeakersPage from "./pages/Speakerspage";
import CartPage from "./pages/Cartpage";
import AuthPage from "./pages/Authpage";
import ProductDetailPage from "./pages/Productdetailpage";

function Home() {
  return (
    <>
      <HeroSlider />
      <Categories />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/headphones" element={<HeadphonesPage />} />
            <Route path="/tws" element={<TWSPage />} />
            <Route path="/smartphones" element={<SmartphonesPage />} />
            <Route path="/laptops" element={<LaptopsPage />} />
            <Route path="/appliances" element={<HomeAppliancesPage />} />
            <Route path="/speakers" element={<SpeakersPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}