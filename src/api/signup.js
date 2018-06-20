import axios from "axios";
import qs from "qs";
import { BACKEND_API } from "../config";

export function signup(user) {
  const instance = axios.create({
    baseURL: `${BACKEND_API}/TRANSPORTS_APP/controller/`,
  });

  let url = "inscription.php";
  let data = qs.stringify({
    nom: user.lastName,
    prenom: user.firstName,
    telephone: user.phoneNumber,
    sexe: user.sex,
    email: user.email,
    password: user.password
  });

  return instance.post(url, data)
    .then((response) => {
      return normalize(response.data);
    });
}

export function modifyUser(user) {
  const instance = axios.create({
    baseURL: `${BACKEND_API}/TRANSPORTS_APP/controller/`,
  });

  let url = "updateUser.php";
  let data = qs.stringify({
    id: user.id,
    nom: user.lastName,
    prenom: user.firstName,
    telephone: user.phoneNumber,
    sexe: user.sex,
    email: user.email,
  });

  return instance.post(url, data)
    .then((response) => {
      return normalize(response.data);
    });
}

export function modifyPassword(id, password) {
  const instance = axios.create({
    baseURL: `${BACKEND_API}/TRANSPORTS_APP/controller/`,
  });

  let url = "updateUser.php";
  let data = qs.stringify({
    id, password
  });

  return instance.post(url, data)
    .then((response) => {
      return normalize(response.data);
    });
}

function normalize(response) {
  if (response.status === true) {
    return {
      id: response.id,
      lastName: response.nom,
      firstName: response.prenom,
      phoneNumber: response.telephone,
      sex: response.sexe,
      email: response.email,
      password: response.password,
    };
  } else {
    console.log(response.message);
    if (response.message === "email deja existant")
      return "email exists";
  }
}
