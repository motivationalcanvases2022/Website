import { getCompanyData } from "../data/companyLoader";
const company = getCompanyData();

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container">
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {company.faq.map((item, index) => (
            <div className="faq-item" key={index}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}