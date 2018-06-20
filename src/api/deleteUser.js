import axios from "axios";
import qs from "qs";
import { BACKEND_API } from "../config";

export default function deleteUser(id) {
  const instance = axios.create({
    baseURL: `${BACKEND_API}/TRANSPORTS_APP/controller/`,
  });

  let url = "supprimerUser.php";
  let data = qs.stringify({
    id_user: id
  });

  return instance.post(url, data)
    .then((response) => {
      if (response.data.status === true) {
        return "user deleted";
      } else {
        return "user delete failed";
      }
    });
}
