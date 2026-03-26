import { getCompanyData } from "../data/companyLoader";

export default function About() {
  const company = getCompanyData();

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about-content">
          <h2>About us</h2>
          <p>{company.aboutText}</p>
        </div>
      </div>
    </section>
  );
}
