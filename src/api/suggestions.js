import axios from "axios";
import qs from "qs";
import { BACKEND_API } from "../config";

export default function getSuggestions(type, query="") {
  const instance = axios.create({
    baseURL: `${BACKEND_API}/TRANSPORTS_APP/controller/`,
  });

  let url = "";
  let params = {};

  switch (type) {
    case "flights":
      url = "suggestions.php";
      params = { query };
      break;
    case "trains":
      url = "gares.php";
      break;
    case "buses":
      url = "stations.php";
      break;
    case "carpools":
      url = "villes.php";
      break;
    case "cities":
      url = "villes.php";
      break;
    default:
      return null;
  }

  return instance.get(url, { params })
    .then((response) => {
      return normalize(response.data, type);
    });
}

function normalize(response, type) {
  if (type === "flights") {
    const data = JSON.parse(response);
    if (data.Places === undefined)
      return [];

    return data.Places.map(place => {
      return {
        label: place.PlaceName,
        value: place.PlaceId.split("-")[0]
      }
    });
  }

  return response.map((s) => {
    return {
      label: s.nom,
      value: s.nom
    };
  });
}
