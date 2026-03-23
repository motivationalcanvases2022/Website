import { getCompanyData } from "../data/companyLoader";
const company = getCompanyData();

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2>About us</h2>
        <p>{company.aboutText}</p>
      </div>
    </section>
  );
}