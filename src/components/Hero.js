import { getCompanyData } from "../data/companyLoader";

export default function Hero() {
  const company = getCompanyData();

  const heroStyle = company.heroImage
    ? {
        backgroundImage: `linear-gradient(rgba(10, 15, 25, 0.78), rgba(10, 15, 25, 0.78)), url(${company.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background:
          "linear-gradient(120deg, #111827 0%, #241318 45%, #dc3f45 100%)",
      };

  return (
    <section id="top" className="hero" style={heroStyle}>
      <div className="container hero-content">
        <p className="eyebrow">
          {company.industry} · {company.city}
        </p>

        <h1>{company.heroTitle}</h1>

        <div className="hero-text-wrapper">
          <p className="hero-text">
            {company.heroSubtitle || company.heroText}
          </p>
        </div>

        <div className="hero-trust-points">
          <span>✓ Kostnadsfri offert</span>
          <span>✓ Snabb återkoppling</span>
          <span>✓ Arbeten i {company.city}</span>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>+50</strong>
            <span>företag hjälpta</span>
          </div>

          <div className="hero-stat">
            <strong>24/7</strong>
            <span>AI-support</span>
          </div>

          <div className="hero-stat">
            <strong>Snabbt</strong>
            <span>klar på dagar</span>
          </div>
        </div>

        <p className="hero-rating">
          ⭐ 4.9 / 5 – betrodda av företag i {company.city}
        </p>

        <div className="hero-actions">
          <a
            className="btn btn-primary"
            href={company.bookingUrl}
            style={{ backgroundColor: company.theme?.primary || "#2563eb" }}
          >
            {company.ctaText || "Få gratis offert inom 24h"}
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