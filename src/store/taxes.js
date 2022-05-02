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
