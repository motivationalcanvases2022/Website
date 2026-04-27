import { getCompanyData } from "../data/companyLoader";

export default function WhyChooseUs() {
  const company = getCompanyData();

  const items =
    company.whyChooseUs && company.whyChooseUs.length > 0
      ? company.whyChooseUs
      : [
          {
            title: "Snabb återkoppling",
            text: "Kunder får snabbt svar och tydlig väg vidare.",
          },
          {
            title: "Smidig kundkontakt",
            text: "Besökare kan enkelt skicka en förfrågan eller boka direkt.",
          },
          {
            title: "Professionellt intryck",
            text: "En modern hemsida skapar förtroende och gör det enklare att välja er.",
          },
        ];

  return (
    <section className="why-section">
      <div className="container why-inner">
        <div className="why-content">
          <p className="section-kicker">Varför välja oss</p>

          <h2>
            En enklare väg från besökare till kund
          </h2>

          <p>
            Vi hjälper {company.companyName} att skapa en tydligare digital
            upplevelse där kunder snabbt kan förstå, kontakta och boka.
          </p>
        </div>

        <div className="why-grid">
          {items.map((item, index) => (
            <article className="why-card" key={index}>
              <div className="why-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}