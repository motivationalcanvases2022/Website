import { Routes, Route } from "react-router-dom";
import { getCompanyData } from "./data/companyLoader";

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import PrivacyPage from "./components/PrivacyPage";
import CookiesPage from "./components/CookiesPage";
import CookieBanner from "./components/CookieBanner";
import SocialProof from "./components/SocialProof";
import Testimonials from "./components/Testimonials";

import "./styles/main.css";

const company = getCompanyData();
const bookingMode = company?.booking?.mode || "direct";

document.documentElement.style.setProperty("--primary", company.theme.primary);
document.documentElement.style.setProperty("--secondary", company.theme.secondary);
document.documentElement.style.setProperty("--bg", company.theme.background);
document.documentElement.style.setProperty("--text", company.theme.text);

console.log("App booking mode:", bookingMode);

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ChatWidget />
      <CookieBanner />
    </>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
      </Routes>
    </div>
  );
}