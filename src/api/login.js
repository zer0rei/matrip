import axios from "axios";
import qs from "qs";
import { BACKEND_API } from "../config";

export default function login(email, password) {
  const instance = axios.create({
    baseURL: `${BACKEND_API}/TRANSPORTS_APP/controller/`,
  });

  let url = "login.php";
  let data = qs.stringify({
    email, password
  });

  return instance.post(url, data)
    .then((response) => {
    console.log(response);
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
    return response.message;
  }
}
