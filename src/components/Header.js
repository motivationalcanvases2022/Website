import { getCompanyData } from "../data/companyLoader";

export default function Header() {
  const company = getCompanyData();

  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#top">
          {company.logo ? (
            <img
              src={company.logo}
              alt={`${company.companyName} logo`}
              className="brand-logo"
            />
          ) : (
            <div
              className="brand-mark"
              style={{ backgroundColor: company.theme?.primary || "#2563eb" }}
            >
              {company.companyName?.charAt(0) || "C"}
            </div>
          )}
          <div className="brand-text">
            <span className="brand-name">{company.companyName}</span>
            <span className="brand-subtitle">
              {company.industry} · {company.city}
            </span>
          </div>
        </a>

        <nav className="nav">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <a
          className="btn btn-primary header-cta"
          href={company.bookingUrl}
          style={{ backgroundColor: company.theme?.primary || "#2563eb" }}
        >
          {company.ctaText || "Book now"}
        </a>
      </div>
    </header>
  );
}