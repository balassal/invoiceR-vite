import data from "./data.json";
import { getBankAccountById } from "./bank";
import { getCurrencyById } from "./currency";
import { getLangById } from "./language";
import { getAddressById } from "./address";

export function getPartners() {
  return data.partners.map(p => getPartnerById(p.id));
}

export function getPartnersByType(type) {
  return data.partners
    .filter(partner => partner.type == type)
    .map(p => getPartnerById(p.id));

}

export function getPartnerById(id) {
  const partner = data.partners.find(inv => inv.id === id);
  const accountIds = partner.bankAccountIds.map(id => getBankAccountById(id));
  const currency = getCurrencyById(partner.currencyId);
  return {
    ...partner,
    bankAccountIds: accountIds,
    currencyId: currency,
    languageId: getLangById(partner.languageId),
    addressIds: partner.addressIds.map(id => getAddressById(id))
  }
}