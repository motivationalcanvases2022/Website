function normalizeCompanyKey(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

function loadAllCompanies() {
  const context = require.context("./companies", false, /\.json$/);
  const companies = {};

  context.keys().forEach((key) => {
    const fileName = key.replace("./", "").replace(".json", "");
    const normalizedKey = normalizeCompanyKey(fileName);
    const fileData = context(key);

    companies[normalizedKey] = fileData.default || fileData;
  });

  return companies;
}

const companies = loadAllCompanies();
const fallbackCompany = companies.kmcgroup || Object.values(companies)[0] || null;

export function getCompanyKeyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return normalizeCompanyKey(params.get("company") || "kmcgroup");
}

export function getCompanyData() {
  const companyKey = getCompanyKeyFromUrl();
  return companies[companyKey] || fallbackCompany;
}

export function getAvailableCompanyKeys() {
  return Object.keys(companies);
}