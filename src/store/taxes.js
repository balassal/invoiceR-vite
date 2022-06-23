import axios from "axios";

const apiURL = process.env.API_URL;

export async function getTaxes() {
  let taxes = [];
  await axios.get(`${apiURL}/taxes`).then((res) => {
    taxes = res.data;
  });
  return taxes;
}

export async function getTaxById(id) {
  let tax = {};
  await axios.get(`${apiURL}/taxes/${id}`).then((res) => {
    tax = res.data;
  });
  return tax;
}

export async function updateTax(updatedTax) {
  const data = JSON.parse(JSON.stringify(updatedTax));
  const res = await axios.put(`${apiURL}/taxes/${data.id}`, data);
  return res;
}

export async function deleteTaxById(id) {
  return axios.delete(`${apiURL}/taxes/${id}`);
}

export async function createTax(tax) {
  const data = JSON.parse(JSON.stringify(tax));
  const res = await axios.post(`${apiURL}/taxes`, data);
  return res;
}
