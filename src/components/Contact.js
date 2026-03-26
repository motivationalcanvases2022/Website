import { getCompanyData } from "../data/companyLoader";

export default function Contact() {
  const company = getCompanyData();

  return (
    <section id="contact" className="section section-alt contact-section">
      <div className="container">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-grid">
          <div className="card contact-card">
            <h3 className="contact-card-title">Visit us</h3>
            <p>{company.address}</p>
            <p>{company.city}</p>
          </div>
          <div className="card contact-card">
            <h3 className="contact-card-title">Contact details</h3>
            <p>
              Phone:{" "}
              <a href={`tel:${company.phone}`} className="contact-link">
                {company.phone}
              </a>
            </p>
            <p>
              Email:{" "}
              <a href={`mailto:${company.email}`} className="contact-link">
                {company.email}
              </a>
            </p>
          </div>
          <div className="card contact-card">
            <h3 className="contact-card-title">Opening hours</h3>
            <p>{company.openingHours}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
