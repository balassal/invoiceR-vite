import data from "./data.json";
import { getCurrencyById } from "./currency"

export function getBankAccounts() {
  return data.bankAccounts.map(acc => getBankAccountById(acc.id));
}

export function getBankAccountById(id) {
  const acc = data.bankAccounts.find(item => item.id === id);
  return {
    ...acc,
    currencyId: getCurrencyById(acc.currencyId)
  }
}