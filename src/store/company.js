import * as data from "./data.json";
import * as fs from "fs";

export function getCompanyDetails() {
  return data.company;
}

export function saveCompany(company) {
  const file = fs.readFile("./data.json");
  console.log("file", file);
}
