import data from "./data.json";

export function getCurrencies() {
  return data.currencies;
}

export function getCurrencyById(id) {
  return data.currencies.find(item => item.id === id);
}