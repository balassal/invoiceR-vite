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
