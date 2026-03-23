import { getCompanyData } from "../data/companyLoader";
const company = getCompanyData();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()} {company.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}