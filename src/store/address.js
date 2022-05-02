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
