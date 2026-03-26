import { getCompanyData } from "../data/companyLoader";

export default function Hero() {
  const company = getCompanyData();

  const heroStyle = company.heroImage
    ? {
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url(${company.heroImage})`
      }
    : {
        background: `linear-gradient(135deg, ${company.theme?.secondary || "#0f172a"} 0%, ${company.theme?.primary || "#2563eb"} 100%)`
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

        <div className="hero-actions">
          <a
            className="btn btn-primary"
            href={company.bookingUrl}
            style={{ backgroundColor: company.theme?.primary || "#2563eb" }}
          >
            {company.ctaText || "Book now"}
          </a>

          <a className="btn btn-secondary" href="#services">
            View services
          </a>
        </div>

        <div className="hero-highlights">
          <div className="hero-highlight-card">
            <strong>{company.city}</strong>
            <span>{company.address}</span>
          </div>

          <div className="hero-highlight-card">
            <strong>Opening hours</strong>
            <span>{company.openingHours}</span>
          </div>

          <div className="hero-highlight-card">
            <strong>Contact</strong>
            <span>{company.phone}</span>
          </div>
        </div>
      </div>
    </section>
  );
}