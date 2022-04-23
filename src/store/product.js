import data from "./data.json";
import { getTaxById } from "./taxes";
import { getUomById } from "./uom";

export function getProducts() {
  return data.products.map(p => getProductById(p.id));
}

export function getProductById(id) {
  const current = data.products.find(inv => inv.id == id);
  return {
    ...current,
    saletaxes: current.saletaxes.map(t => getTaxById(t)),
    purchasetaxes: current.purchasetaxes.map(t => getTaxById(t)),
    uomId: getUomById(current.uomId)
  }
}