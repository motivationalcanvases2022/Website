import { getCompanyData } from "../data/companyLoader";

export default function Testimonials() {
  const company = getCompanyData();

  const testimonials = company.testimonials || [
    {
      quote:
        "Vi fick en modernare hemsida och ett mycket tydligare sätt för kunder att kontakta oss.",
      name: "Lokal företagare",
      role: "Stockholm",
    },
    {
      quote:
        "Bokningsflödet gör det enklare för kunder att välja tider utan att behöva ringa.",
      name: "Tjänsteföretag",
      role: "Kundbokning",
    },
    {
      quote:
        "Sidan känns professionell och hjälper oss presentera våra tjänster på ett bättre sätt.",
      name: "Småföretagare",
      role: "Digital närvaro",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-top">
          <p className="section-kicker">Kundröster</p>
          <h2>Företag behöver hemsidor som faktiskt skapar kontakt</h2>
          <p>
            En modern hemsida, tydlig bokning och smart automation gör det
            enklare för kunder att ta nästa steg.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <article className="testimonial-card" key={index}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">“{item.quote}”</p>

              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {item.name.charAt(0)}
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