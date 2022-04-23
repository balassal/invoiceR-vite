import data from "./data.json";

export function getLanguages() {
  return data.languages;
}

export function getLangById(id) {
  return data.languages.find(lang => lang.id == id);
}