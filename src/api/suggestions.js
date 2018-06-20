import axios from "axios";
import { BACKEND_API } from "../config";

export default function getSuggestions(type, query="", src="") {
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
      params = (src !== "") ? { from: src } : {};
      break;
    case "buses":
      url = "stations.php";
      params = (src !== "") ? { from: src } : {};
      break;
    case "carpools":
      url = "villes.php";
      params = (src !== "") ? { from: src } : {};
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
    const data = response;
    if (data.Places === undefined)
      return [];

    return data.Places.map(place => {
      return {
        label: place.PlaceName,
        value: place.PlaceId.split("-")[0]
      }
    });
  }

  let suggestions = response.map((s) => {
    let result;
    switch (type) {
      case "trains":
        result = s.gare;
        break;
      case "buses":
        result = s.station;
        break;
      default:
        result = s.ville;
    }

    return {
      label: result,
      value: result
    };
  });

  // remove duplicates
  return suggestions.filter((s, index, self) =>
    self.findIndex(t => t.label === s.label && t.value === s.value) === index)
}
