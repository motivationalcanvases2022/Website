import { getCompanyData } from "../data/companyLoader";

export default function Footer() {
  const company = getCompanyData();

  return (
    <footer className="footer premium-footer">
      <div className="container footer-grid">

        {/* LOGO + BRAND */}
        <div className="footer-brand">
          <img src={company.logo} alt="logo" className="footer-logo" />
          <h3>{company.companyName}</h3>
          <p>
            {company.industry} i {company.city}. Vi hjälper företag växa digitalt.
          </p>
        </div>

        {/* SNABBA LÄNKAR */}
        <div className="footer-links">
          <h4>Snabblänkar</h4>
          <a href="#about">Om oss</a>
          <a href="#services">Tjänster</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Kontakt</a>
        </div>

        {/* KONTAKT */}
        <div className="footer-contact">
          <h4>Kontakt</h4>
          <p>{company.address}</p>
          <p>{company.city}</p>
          <p>{company.phone}</p>
          <p>{company.email}</p>
        </div>

        {/* POLICY */}
        <div className="footer-legal">
          <h4>Juridik</h4>
          <a href="/privacy">Integritetspolicy</a>
          <a href="/cookies">Cookies</a>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {company.companyName}</p>
      </div>
    </footer>
  );
}