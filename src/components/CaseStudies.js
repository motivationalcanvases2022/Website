import { useState } from "react";
import { getCompanyData } from "../data/companyLoader";

export default function Case() {
  const company = getCompanyData();
  const projects = company.caseStudies || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!projects.length) return null;

  const project = projects[currentIndex];

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? projects.length - 1 : prev - 1
    );
  };

  return (
    <section id="case" className="case-section">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{company.caseEyebrow || "Tidigare arbeten"}</p>
          <h2>{company.caseTitle || "Före och efter"}</h2>
          <p>
            {company.caseIntro ||
              "Se exempel på tidigare projekt och resultat."}
          </p>
        </div>

        <div className="before-after-wrapper">
          {projects.length > 1 && (
            <button className="case-arrow left" onClick={prevProject}>
              ←
            </button>
          )}

          <div className="before-after-grid">
            <div className="before-after-card">
              <div className="image-label">Före</div>
              <img src={project.beforeImage} alt={`${project.title} före`} />

              <div className="before-after-content">
                <p className="case-tag">FÖRE</p>
                <h3>{project.title}</h3>
                <p>{project.beforeText}</p>
              </div>
            </div>

            <div className="before-after-card">
              <div className="image-label">Efter</div>
              <img src={project.afterImage} alt={`${project.title} efter`} />

              <div className="before-after-content">
                <p className="case-tag">EFTER</p>
                <h3>{project.title}</h3>
                <p>{project.afterText}</p>
              </div>
            </div>
          </div>

          {projects.length > 1 && (
            <button className="case-arrow right" onClick={nextProject}>
              →
            </button>
          )}
        </div>

        {projects.length > 1 && (
          <div className="case-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={index === currentIndex ? "active" : ""}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}