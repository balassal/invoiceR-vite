import axios from "axios";
import { getAddressById } from "./address";
import { getBankAccountById } from "./bank";
import { getCurrencyById } from "./currency";
import { getLangById } from "./language";

const apiURL = process.env.API_URL;

export async function getCompanyDetails() {
  let company = {};
  await axios.get(`${apiURL}/company`).then((res) => {
    company = res.data;
  });
  return {
    ...company,
    addressIds: await Promise.all(
      company.addressIds.map(async (addr) => getAddressById(addr))
    ),
    bankAccountIds: await Promise.all(
      company.bankAccountIds.map(async (acc) => getBankAccountById(acc))
    ),
    currencyId: await getCurrencyById(company.currencyId),
    languageId: await getLangById(company.languageId),
  };
}

export async function saveCompany(company) {
  const data = JSON.parse(JSON.stringify(company));
  const toSave = {
    name: data.name,
    shortName: data.shortName,
    vatnumber: data.vatnumber,
    addressIds: data.addressIds.map((addrs) => addrs.id),
    bankAccountIds: data.bankAccountIds.map((bid) => bid.id),
    currencyId: data.currencyId.id,
    languageId: data.languageId.id,
  };
  const res = await axios.put(`${apiURL}/company`, toSave);
  return res;
}
