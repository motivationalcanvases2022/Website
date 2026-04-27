import { getCompanyData } from "../data/companyLoader";

export default function CTASection() {
  const company = getCompanyData();

  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <h2>
          Behöver du hjälp med {company.industry.toLowerCase()}?
        </h2>

        <p>
          Skicka en förfrågan idag så återkommer vi snabbt med en lösning.
        </p>

        <div className="cta-actions">
          <a className="btn btn-primary" href={company.bookingUrl}>
            {company.ctaText || "Boka kostnadsfritt"}
          </a>

          {company.phone && (
            <a className="btn btn-secondary" href={`tel:${company.phone}`}>
              Ring {company.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}