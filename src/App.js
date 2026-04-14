import { getCompanyData } from "./data/companyLoader";

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import "./styles/main.css";

const company = getCompanyData();
const bookingMode = company?.booking?.mode || "direct";

document.documentElement.style.setProperty("--primary", company.theme.primary);
document.documentElement.style.setProperty("--secondary", company.theme.secondary);
document.documentElement.style.setProperty("--bg", company.theme.background);
document.documentElement.style.setProperty("--text", company.theme.text);

console.log("App booking mode:", bookingMode);

export default function App() {
  return (
    <div className="site-shell">
      <Header />
      <Hero />
      <About />
      <Services />
      <FAQ />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  );
}