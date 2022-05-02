import axios from "axios";
import { getCurrencyById } from "./currency";

const apiURL = process.env.API_URL;

export async function getBankAccounts() {
  let accounts = [];
  await axios.get(`${apiURL}/bankAccounts`).then((res) => {
    accounts = res.data;
  });

  const result = await Promise.all(
    accounts.map(async (acc) => await getBankAccountById(acc.id))
  );
  return result;
}

export async function getBankAccountById(id) {
  let account = {};
  await axios.get(`${apiURL}/bankAccounts/${id}`).then((res) => {
    account = res.data;
  });

  return {
    ...account,
    currencyId: await getCurrencyById(account.currencyId),
  };
}
