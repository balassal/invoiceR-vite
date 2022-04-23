import data from "./data.json";

export function getTaxes() {
  return data.taxes;
}

export function getTaxById(id) {
  return data.taxes.find(inv => inv.id == id);
}