import { getBankAccountById } from "./bank";
import { getCurrencyById } from "./currency";
import { getLangById } from "./language";
import { getAddressById } from "./address";

import axios from "axios";

const apiURL = process.env.API_URL;

export async function getPartners() {
  let partners = [];
  await axios.get(`${apiURL}/partners`).then((res) => {
    partners = res.data;
  });

  const result = await Promise.all(
    partners.map(async (partner) => await getPartnerById(partner.id))
  );
  return result;
}

export async function getPartnerById(id) {
  let partner = {};
  await axios.get(`${apiURL}/partners/${id}`).then((res) => {
    partner = res.data;
  });

  return {
    ...partner,
    bankAccountIds: await Promise.all(
      partner.bankAccountIds.map(async (acc) => await getBankAccountById(acc))
    ),
    currencyId: await getCurrencyById(partner.currencyId),
    languageId: await getLangById(partner.languageId),
    addressIds: await Promise.all(
      partner.addressIds.map(async (id) => await getAddressById(id))
    ),
  };
}
