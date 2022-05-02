import axios from "axios";

const apiURL = process.env.API_URL;

export async function getUoms() {
  let uoms = [];
  await axios.get(`${apiURL}/uoms`).then((res) => {
    uoms = res.data;
  });
  return uoms;
}

export async function getUomById(id) {
  let uom = {};
  await axios.get(`${apiURL}/uoms/${id}`).then((res) => {
    uom = res.data;
  });
  return uom;
}
