import dentist from "./companies/dentist.json";
import gym from "./companies/gym.json";
import restaurant from "./companies/restaurant.json";
import electrician from "./companies/electrician.json";
import kmcgroup from "./companies/kmcgroup.json";
import nordebergentrepenadab from "./companies/nordebergentrepenadab.json";

const companies = {
  dentist,
  gym,
  restaurant,
  electrician,
  kmcgroup,
  nordebergentrepenadab
};

export function getCompanyData() {
  const params = new URLSearchParams(window.location.search);
  const companyName = params.get("company") || "kmcgroup";

  return companies[companyName] || kmcgroup;
}