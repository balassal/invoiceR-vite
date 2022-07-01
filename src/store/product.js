import { getTaxById } from "./taxes";
import { getUomById } from "./uom";

import axios from "axios";

const apiURL = process.env.API_URL;

export async function getProducts() {
  let products = [];
  await axios.get(`${apiURL}/products`).then((res) => {
    products = res.data;
  });

  const result = await Promise.all(
    products.map(async (prod) => await getProductById(prod.id))
  );
  return result;
}

export async function getProductById(id) {
  let product = {};
  await axios.get(`${apiURL}/products/${id}`).then((res) => {
    product = res.data;
  });

  return {
    ...product,
    saletaxes: await Promise.all(
      product.saletaxes.map(async (t) => await getTaxById(t))
    ),
    purchasetaxes: await Promise.all(
      product.purchasetaxes.map(async (t) => await getTaxById(t))
    ),
    uomId: await getUomById(product.uomId),
  };
}

export async function updateProduct(updProduct) {
  const data = JSON.parse(JSON.stringify(updProduct));
  data.saletaxes = data.saletaxes.map((t) => t.id);
  data.purchasetaxes = data.purchasetaxes.map((t) => t.id);
  data.uomId = data.uomId.id;
  const res = await axios.put(`${apiURL}/products/${data.id}`, data);
  return res;
}

export async function deleteProduct(id) {
  return axios.delete(`${apiURL}/products/${id}`);
}

export async function createProduct(newProduct) {
  const data = JSON.parse(JSON.stringify(newProduct));
  data.saletaxes = data.saletaxes.map((t) => t.id);
  data.purchasetaxes = data.purchasetaxes.map((t) => t.id);
  data.uomId = data.uomId.id;
  const res = await axios.post(`${apiURL}/products`, data);
  return res;
}
