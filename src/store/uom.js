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

export async function createUom(uom) {
  const data = JSON.parse(JSON.stringify(uom));
  const res = await axios.post(`${apiURL}/uoms`, data);
  return res;
}

export async function deleteUom(id) {
  return await axios.delete(`${apiURL}/uoms/${id}`);
}

export async function updateUom(updUom) {
  const data = JSON.parse(JSON.stringify(updUom));
  const res = await axios.put(`${apiURL}/uoms/${data.id}`, data);
  return res;
}
