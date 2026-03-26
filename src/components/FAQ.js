import React, { useState } from "react";
import { getCompanyData } from "../data/companyLoader";

export default function FAQ() {
  const company = getCompanyData();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section">
      <div className="container">
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {company.faq.map((item, index) => (
            <div
              className={`faq-item${openIndex === index ? " expanded" : ""}`}
              key={index}
            >
              <h3
                className="faq-question"
                onClick={() => toggleQuestion(index)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleQuestion(index);
                }}
                role="button"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                {item.question}
              </h3>
              {openIndex === index && (
                <p
                  className="faq-answer"
                  id={`faq-answer-${index}`}
                  aria-labelledby={`faq-question-${index}`}
                >
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
