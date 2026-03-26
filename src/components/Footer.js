import { getCompanyData } from "../data/companyLoader";

export default function Footer() {
  const company = getCompanyData();

  return (
    <footer className="footer premium-footer">
      <div className="container footer-content">
        <p className="copyright">
          9 {new Date().getFullYear()} {company.companyName}. All rights reserved.
        </p>
        <div className="social-icons" aria-label="Social media links">
          <div className="social-icon-placeholder" aria-hidden="true" />
          <div className="social-icon-placeholder" aria-hidden="true" />
          <div className="social-icon-placeholder" aria-hidden="true" />
          <div className="social-icon-placeholder" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
