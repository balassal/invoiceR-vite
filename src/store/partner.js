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

export async function updatePartner(updPartner) {
  const data = JSON.parse(JSON.stringify(updPartner));
  data.bankAccountIds = data.bankAccountIds.map((acc) => acc.id);
  data.currencyId = data.currencyId.id;
  data.languageId = data.languageId.id;
  data.addressIds = data.addressIds.map((acc) => acc.id);

  const res = await axios.put(`${apiURL}/partners/${data.id}`, data);
  return res;
}

export async function deletePartner(id) {
  return axios.delete(`${apiURL}/partners/${id}`);
}

export async function createPartner(newPartner) {
  const data = JSON.parse(JSON.stringify(newPartner));
  data.bankAccountIds = data.bankAccountIds.map((acc) => acc.id);
  data.currencyId = data.currencyId.id;
  data.languageId = data.languageId.id;
  data.addressIds = data.addressIds.map((acc) => acc.id);

  const res = await axios.post(`${apiURL}/partners`, data);
  return res;
}
