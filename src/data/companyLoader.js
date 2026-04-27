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

function getCompanyKeyFromDomain() {
  const host = window.location.hostname.toLowerCase();

  if (host.includes("nordeberg.se")) {
    return "nordebergentrepenadab";
  }

  if (host.includes("kmcgroup.se")) {
    return "kmcgroup";
  }

  return "kmcgroup";
}

export function getCompanyKeyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const companyFromUrl = params.get("company");

  if (companyFromUrl) {
    return normalizeCompanyKey(companyFromUrl);
  }

  return getCompanyKeyFromDomain();
}

export function getCompanyData() {
  const companyKey = getCompanyKeyFromUrl();
  return companies[companyKey] || fallbackCompany;
}

export function getAvailableCompanyKeys() {
  return Object.keys(companies);
}