import { getCompanyData } from "../data/companyLoader";

export default function SocialProof() {
  const company = getCompanyData();

  return (
    <section className="social-proof">
      <div className="container social-proof-inner">
        <p className="social-proof-kicker">Förtroende & resultat</p>

        <div className="social-proof-grid">
          <div>
            <strong>24/7</strong>
            <span>AI-support & bokningsflöde</span>
          </div>

          <div>
            <strong>10 sek</strong>
            <span>Snabb väg till bokning</span>
          </div>

          <div>
            <strong>{company.city}</strong>
            <span>Byggt för lokala företag</span>
          </div>
        </div>
      </div>
    </section>
  );
}