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
