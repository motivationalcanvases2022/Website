import { getCompanyData } from "../data/companyLoader";

export default function CaseStudies() {
  const company = getCompanyData();

  const cases =
    company.caseStudies && company.caseStudies.length > 0
      ? company.caseStudies
      : [
          {
            title: "Projekt anpassat efter kundens behov",
            category: company.industry || "Projekt",
            description:
              "Ett exempel på hur rätt lösning kan göra det enklare för kunder att förstå tjänsten och ta kontakt.",
            image: "",
          },
          {
            title: "Tydligare kundresa",
            category: "Kundkontakt",
            description:
              "Struktur, tydlig information och smart bokning hjälper besökare att snabbare ta nästa steg.",
            image: "",
          },
          {
            title: "Professionellt första intryck",
            category: "Digital närvaro",
            description:
              "En modern presentation skapar mer förtroende redan vid första besöket.",
            image: "",
          },
        ];

  return (
    <section className="case-section">
      <div className="container">
        <div className="case-header">
          <p className="section-kicker">Utförda projekt</p>
          <h2>Resultat som hjälper kunder att känna förtroende</h2>
          <p>
            Visa exempel på tidigare arbeten, tjänster eller projekt för att
            göra beslutet enklare för nya kunder.
          </p>
        </div>

        <div className="case-grid">
          {cases.map((item, index) => (
            <article className="case-card" key={index}>
              <div className="case-image">
                {item.image ? (
                  <img src={item.image} alt={item.title} />
                ) : (
                  <div className="case-placeholder">
                    <span>{item.category}</span>
                  </div>
                )}
              </div>

              <div className="case-body">
                <span className="case-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}