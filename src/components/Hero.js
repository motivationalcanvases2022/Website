import { getCompanyData } from "../data/companyLoader";

export default function Hero() {
  const company = getCompanyData();

  const stats = company.stats || [
    { value: "+50", label: "företag hjälpta" },
    { value: "24/7", label: "AI-support" },
    { value: "Snabbt", label: "klar på dagar" },
  ];

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

        <h1>
          Få fler kunder via din hemsida i {company.city}
        </h1>

        <div className="hero-text-wrapper">
          <p className="hero-text">
            Vi bygger hemsidor och bokningssystem som gör det enkelt för dina kunder att kontakta dig och boka direkt – utan krångel.
          </p>
        </div>

        {/* Trust badges */}
        <div className="hero-trust-points">
          <span>✓ Kostnadsfri offert</span>
          <span>✓ Snabb återkoppling</span>
          <span>✓ Arbeten i {company.city}</span>
        </div>

        <div className="hero-stats">
          {stats.map((item, index) => (
            <div className="hero-stat" key={index}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Rating */}
        <p className="hero-rating">
          ⭐ 4.75 / 5 – betrodda av företag i {company.city}
        </p>

        {/* CTA */}
        <div className="hero-actions">
          <a
            className="btn btn-primary"
            href={company.bookingUrl}
            style={{ backgroundColor: company.theme?.primary || "#2563eb" }}
          >
            Få gratis offert inom 24h
          </a>

          <a className="btn btn-secondary" href="#services">
            Se våra tjänster
          </a>
        </div>

        {/* Micro trust */}
        <p className="hero-micro">
          ✓ Svar inom 24h &nbsp;&nbsp; ✓ Kostnadsfri analys &nbsp;&nbsp; ✓ Inga förpliktelser
        </p>

        {/* Phone (secondary CTA) */}
        {company.phone && (
          <a className="hero-phone" href={`tel:${company.phone}`}>
            Eller ring direkt: {company.phone}
          </a>
        )}

      </div>
    </section>
  );
}