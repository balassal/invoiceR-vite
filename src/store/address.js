import axios from "axios";

const apiURL = process.env.API_URL;

export async function getAddresses() {
  let addresses = [];
  await axios.get(`${apiURL}/addresses`).then((res) => {
    addresses = res.data;
  });
  return addresses;
}

export async function getAddressById(id) {
  let address = {};
  await axios.get(`${apiURL}/addresses/${id}`).then((res) => {
    address = res.data;
  });
  return address;
}

export async function createAddress(newAddr) {
  const data = JSON.parse(JSON.stringify(newAddr));
  const res = axios.post(`${apiURL}/addresses`, data);
  return res;
}

export async function updateAddress(updAddr) {
  const data = JSON.parse(JSON.stringify(updAddr));
  const res = axios.put(`${apiURL}/addresses/${data.id}`, data);
  return res;
}

export async function deleteAddress(id) {
  return axios.delete(`${apiURL}/addresses/${id}`);
}
