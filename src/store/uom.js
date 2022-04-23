import data from "./data.json";

export function getUoms() {
  return data.uoms;
}

export function getUomById(id) {
  return data.uoms.find(inv => inv.id == id);
}