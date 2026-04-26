import { getCompanyData } from "../data/companyLoader";

export default function Testimonials() {
  const company = getCompanyData();

  const testimonials = company.testimonials || [
    {
      quote:
        "Vi fick en modernare hemsida och ett smidigare sätt att ta emot kundförfrågningar.",
      name: "Lokal företagare",
      role: company.city,
    },
    {
      quote:
        "Bokningsflödet gör det enklare för kunder att ta kontakt utan att behöva ringa.",
      name: "Tjänsteföretag",
      role: "Kundservice",
    },
    {
      quote:
        "En tydlig och professionell lösning som hjälper oss att se mer seriösa ut online.",
      name: "Småföretagare",
      role: "Digital närvaro",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header testimonials-header">
          <p className="section-kicker">Kundröster</p>
          <h2>Byggt för företag som vill få fler förfrågningar</h2>
          <p>
            En modern hemsida, smart bokning och AI-support hjälper kunder att
            ta nästa steg snabbare.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <article className="testimonial-card" key={index}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">“{item.quote}”</p>

              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {item.name?.charAt(0) || "K"}
                </div>

                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}