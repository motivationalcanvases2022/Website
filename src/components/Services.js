import { getCompanyData } from "../data/companyLoader";
const company = getCompanyData();

export default function Services() {
  return (
    <section id="services" className="section section-alt">
      <div className="container">
        <h2>Services</h2>
        <div className="cards">
          {company.services.map((service, index) => (
            <div className="card" key={index}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}