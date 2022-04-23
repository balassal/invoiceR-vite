import data from "./data.json";

export function getAddresses() {
  return data.addresses;
}

export function getAddressById(id) {
  return data.addresses.find(item => item.id == id);
}