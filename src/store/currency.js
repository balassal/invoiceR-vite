import axios from "axios";

const apiURL = process.env.API_URL;

export async function getCurrencies() {
  let currencies = [];
  await axios.get(`${apiURL}/currencies`).then((res) => {
    currencies = res.data;
  });
  return currencies;
}

export async function getCurrencyById(id) {
  let currency = {};
  await axios.get(`${apiURL}/currencies/${id}`).then((res) => {
    currency = res.data;
  });
  return currency;
}
