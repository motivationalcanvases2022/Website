import { getCompanyData } from "../data/companyLoader";

export default function ProcessSection() {
  const company = getCompanyData();

  const steps = company.process || [
    {
      title: "Skicka en förfrågan",
      text: "Berätta kort vad du behöver hjälp med eller boka en tid direkt.",
    },
    {
      title: "Vi går igenom behovet",
      text: "Vi återkommer snabbt och tar fram en tydlig plan eller offert.",
    },
    {
      title: "Vi bygger lösningen",
      text: "Hemsida, bokning och smarta funktioner sätts upp efter dina behov.",
    },
    {
      title: "Lansering & support",
      text: "När allt är klart hjälper vi dig komma igång och kan fortsätta förbättra sidan.",
    },
  ];

  return (
    <section className="process-section">
      <div className="container">
        <div className="process-header">
          <p className="section-kicker">Så går det till</p>
          <h2>Från idé till färdig hemsida utan krångel</h2>
          <p>
            En tydlig process gör det enkelt att komma igång och veta vad som
            händer i varje steg.
          </p>
        </div>

        <div className="process-grid">
          {steps.map((step, index) => (
            <article className="process-card" key={index}>
              <span className="process-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}