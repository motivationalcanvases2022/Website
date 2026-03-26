import { getCompanyData } from "../data/companyLoader";

export default function Services() {
  const company = getCompanyData();

  return (
    <section id="services" className="section section-alt">
      <div className="container">
        <h2>Services</h2>
        <div className="cards services-cards">
          {company.services.map((service, index) => (
            <div className="card service-card" key={index}>
              <div className="service-icon-placeholder" aria-hidden="true" />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
