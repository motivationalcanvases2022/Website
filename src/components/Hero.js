import { getCompanyData } from "../data/companyLoader";

export default function Hero() {
  const company = getCompanyData();

  const heroStyle = company.heroImage
    ? {
        backgroundImage: `linear-gradient(rgba(10, 15, 25, 0.75), rgba(10, 15, 25, 0.75)), url(${company.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: "#0f172a" // mörk, inte gradient
      };

  return (
    <section id="top" className="hero" style={heroStyle}>
      <div className="container hero-content">
        <p className="eyebrow">
          {company.industry} · {company.city}
        </p>

        <h1>{company.heroTitle}</h1>

        <div className="hero-text-wrapper">
          <p className="hero-text">{company.heroSubtitle || company.heroText}</p>
        </div>

        <div className="hero-trust-points">
          <span>✓ Kostnadsfri offert</span>
          <span>✓ Snabb återkoppling</span>
          <span>✓ Arbeten i {company.city}</span>
        </div>

        <div className="hero-actions">
          <a
            className="btn btn-primary"
            href={company.bookingUrl}
            style={{ backgroundColor: company.theme?.primary || "#2563eb" }}
          >
            {company.ctaText || "Boka kostnadsfritt hembesök"}
          </a>

          <a className="btn btn-secondary" href="#services">
            Se våra tjänster
          </a>

          {company.phone && (
            <a className="btn btn-secondary" href={`tel:${company.phone}`}>
              Ring {company.phone}
            </a>
          )}
        </div>

        <div className="hero-highlights">
          <div className="hero-highlight-card">
            <strong>Verksamhetsområde</strong>
            <span>{company.city} och närområde</span>
          </div>

          <div className="hero-highlight-card">
            <strong>Offert</strong>
            <span>Kostnadsfri första kontakt</span>
          </div>

          <div className="hero-highlight-card">
            <strong>Telefon</strong>
            <span>{company.phone}</span>
          </div>
        </div>
      </div>
    </section>
  );
}