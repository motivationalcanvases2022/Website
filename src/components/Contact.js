import { getCompanyData } from "../data/companyLoader";
const company = getCompanyData();

export default function Contact() {
  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <h2>Contact</h2>
        <div className="contact-grid">
          <div className="card">
            <h3>Visit us</h3>
            <p>{company.address}</p>
            <p>{company.city}</p>
          </div>
          <div className="card">
            <h3>Contact details</h3>
            <p>Phone: {company.phone}</p>
            <p>Email: {company.email}</p>
          </div>
          <div className="card">
            <h3>Opening hours</h3>
            <p>{company.openingHours}</p>
          </div>
        </div>
      </div>
    </section>
  );
}