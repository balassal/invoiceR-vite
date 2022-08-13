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

export async function createBankAccount(newAcc) {
  const data = JSON.parse(JSON.stringify(newAcc));
  const res = axios.post(`${apiURL}/bankAccounts`, data);
  return res;
}

export async function updateBankAccount(updAcc) {
  const data = JSON.parse(JSON.stringify(updAcc));
  const res = axios.put(`${apiURL}/bankAccounts/${data.id}`, data);
  return res;
}

export async function deleteBankAccount(id) {
  return axios.delete(`${apiURL}/bankAccounts/${id}`);
}
