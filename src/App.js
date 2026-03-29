import { getCompanyData } from "./data/companyLoader";

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import DashboardPage from "./DashboardPage";
import "./styles/main.css";

const path = window.location.pathname;

if (path !== "/dashboard") {
  const company = getCompanyData();

  document.documentElement.style.setProperty("--primary", company.theme.primary);
  document.documentElement.style.setProperty("--secondary", company.theme.secondary);
  document.documentElement.style.setProperty("--bg", company.theme.background);
  document.documentElement.style.setProperty("--text", company.theme.text);
}

export default function App() {
  if (path === "/dashboard") {
    return <DashboardPage />;
  }

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