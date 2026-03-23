import dentist from "./companies/dentist.json";
import gym from "./companies/gym.json";
import restaurant from "./companies/restaurant.json";

const companies = {
  dentist,
  gym,
  restaurant
};

export function getCompanyData() {
  const params = new URLSearchParams(window.location.search);
  const companyName = params.get("company") || "dentist";

  return companies[companyName] || dentist;
}