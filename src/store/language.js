import axios from "axios";

const apiURL = process.env.API_URL;

export async function getLanguages() {
  let languages = [];
  await axios.get(`${apiURL}/languages`).then((res) => {
    languages = res.data;
  });
  return languages;
}

export async function getLangById(id) {
  let language = {};
  await axios.get(`${apiURL}/languages/${id}`).then((res) => {
    language = res.data;
  });
  return language;
}

export async function saveLanguages(newLang) {
  return await axios.post(`${apiURL}/languages`, newLang);
}

export async function deleteLanguage(id) {
  return await axios.delete(`${apiURL}/languages/${id}`);
}

export async function updateLanguage(updLang) {
  const data = JSON.parse(JSON.stringify(updLang));
  const res = await axios.put(`${apiURL}/languages/${data.id}`, data);
  return res;
}
