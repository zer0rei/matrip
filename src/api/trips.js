import axios from "axios";
import { format } from "date-fns";
import { BACKEND_API } from "../config";

const instance = axios.create({
  baseURL: `${BACKEND_API}/TRANSPORTS_APP/controller/`
});

export default function getTrips(request, type) {
  switch (type) {
    case "flights":
      return getFlights(request);
    case "trains":
      return getTrains(request);
    case "buses":
      return getBuses(request);
    case "carpools":
      return getCarpools(request);
    default:
      return null;
  }
}

export function getFlights(request) {
  return instance.get("flights.php", {
    params: {
      src: request.source,
      dst: request.destination,
      departDate: format(request.departDate, "YYYY-MM-DD"),
      returnDate: request.isOneWay ?
        "" : format(request.returnDate, "YYYY-MM-DD"),
    }
  })
  .then((response) => {
    return normalizeFlights(request, JSON.parse(response.data));
  });
}

export function getTrains(request) {
  let dep = () => {
    return instance.get("consulterTrain.php", {
      params: {
        gareDepart: request.source,
        gareDestination: request.destination,
        heureDepart: format(request.departDate, "HH:mm:ss"),
      }
    });
  };

  let ret = () => {
    return request.isOneWay ? null : instance.get("consulterTrain.php", {
      params: {
        gareDepart: request.destination,
        gareDestination: request.source,
        heureDepart: format(request.returnDate, "HH:mm:ss"),
      }
    });
  };

  return axios.all([dep(), ret()])
  .then(axios.spread(function (depResponse, retResponse) {
    if (request.isOneWay) {
      return normalizeTrains(request, depResponse.data);
    } else {
      return normalizeTrains(request, depResponse.data, retResponse.data);
    }
  }));
}

export function getBuses(request) {
  let dep = () => {
    return instance.get("consulterBus.php", {
      params: {
        from: request.source,
        to: request.destination,
        ville: request.city
      }
    });
  };

  let ret = () => {
    return request.isOneWay ? null : instance.get("consulterBus.php", {
      params: {
        from: request.destination,
        to: request.source,
        ville: request.city
      }
    });
  };

  return axios.all([dep(), ret()])
  .then(axios.spread(function (depResponse, retResponse) {
    if (depResponse.data.status === true) {
      if (request.isOneWay) {
        return normalizeBuses(request, depResponse.data);
      } else {
        if (retResponse.data.status === true) {
          return normalizeBuses(request, depResponse.data, retResponse.data);
        }
      }
    } else {
      console.log(depResponse.data.message);
      console.log(retResponse !== null ? retResponse.data.message : "");
    }
  }));
}

function getCarpools(request) {
  let dep = () => {
    return instance.get("consulterCovoit.php", {
      params: {
        ville_depart: request.source,
        ville_destination: request.destination,
        //date_voyage: format(request.departDate, "YYYY-MM-DD"),
      }
    });
  };

  let ret = () => {
    return request.isOneWay ? null : instance.get("consulterCovoit.php", {
      params: {
        ville_depart: request.destination,
        ville_destination: request.source,
        //date_voyage: format(request.returnDate, "YYYY-MM-DD"),
      }
    });
  };

  return axios.all([dep(), ret()])
  .then(axios.spread(function (depResponse, retResponse) {
    if (request.isOneWay) {
      return normalizeCarpools(request, depResponse.data);
    } else {
      return normalizeCarpools(request, depResponse.data, retResponse.data);
    }
  }));
}

function normalizeFlights(request, response) {
  if (response === undefined || response === {} ||
    response.Quotes === undefined || response.Quotes === [])
    return null;

  let trips = response.Quotes.map(trip => {
    let inCarr = response.Carriers.filter((carr) => {
      return carr.CarrierId === trip.OutboundLeg.CarrierIds[0];
    });

    let res1 = {
      id: trip.id,
      source: request.source,
      destination: request.destination,
      departDate: new Date(trip.OutboundLeg.DepartureDate),
      price: request.numTravellers * trip.MinPrice,
      direct: trip.Direct,
      carrier: inCarr[0].Name
    };

    if (request.isOneWay || trip.InboundLeg === undefined)
      return res1;

    let outCarr = response.Carriers.filter((carr) => {
        return carr.CarrierId === trip.InboundLeg.CarrierIds[0];
    });

    let res2 = {
      returnDate: new Date(trip.InboundLeg.DepartureDate),
      returnDirect: trip.Direct,
      returnCarrier: outCarr[0].Name
    }

    return Object.assign(res1, res2);
  });

  return trips;
}

function normalizeTrains(request, response, response2=undefined) {
  if (response.constructor !== Array || response === [])
    return null;

  let trips1 = response.map(trip => {
    return {
      id: trip.id,
      source: trip.gareDepart,
      destination: trip.gareDestination,
      departDate: new Date(format(request.departDate,
        "YYYY-MM-DDT") + trip.heureDepart),
      arrivalDate: new Date(format(request.departDate,
        "YYYY-MM-DDT") + trip.heureArrivee),
      price: request.numTravellers * (request.cabinClass === 0 ?
        trip.prix_deuxieme : trip.prix_premier),
      direct: trip.correspondance.toUpperCase() === "DIRECT",
      carrier: "ONCF",
    }
  });

  if (request.isOneWay || response2 === undefined ||
    response2.constructor !== Array || response2 === []) {
    return trips1;
  }

  let trips2 = response2.map(trip => {
    return {
      returnDate: new Date(format(request.returnDate,
        "YYYY-MM-DDT") + trip.heureDepart),
      returnArrivalDate: new Date(format(request.returnDate,
        "YYYY-MM-DDT") + response.heureArrivee),
      returnDirect: trip.correspondance === "directe",
      returnPrice: request.numTravellers * (request.cabinClass === 0 ?
        trip.prix_deuxieme : trip.prix_premier),
      returnCarrier: "ONCF"
    }
  });

  let trips = []; 
  trips1.forEach(trip1 => {
    trips2.forEach(trip2 => {
      trips.push(Object.assign(trip1, trip2)); 
    })
  });

  return trips;
}

function normalizeBuses(request, response, response2=undefined) {
  if (response === undefined || response === {} || response.frequence === undefined)
    return null;

  let trips1 = {
    source: response.depart,
    destination: response.destination,
    departDate: new Date(format(request.departDate,
      "YYYY-MM-DDT") + response.premier_depart),
    duration: parseInt(response.frequence.split("-")[1]),
    price: request.numTravellers * 3.5,
    line: response.ligne,
    carrier: "ALSA",
  }

  if (request.isOneWay || response2 === undefined) {
    return [ trips1 ];
  }

  let trips2 = {
    departDate: new Date(format(request.returnDate,
      "YYYY-MM-DDT") + response.dernier_depart),
    returnDuration: parseInt(response2.frequence.split("-")[1]),
    returnPrice: request.numTravellers * 3.5,
    returnLine: response2.ligne,
    returnCarrier: "ALSA",
  }

  let trips = Object.assign(trips1, trips2); 

  return [ trips ];
  
}

function normalizeCarpools(request, response, response2=undefined) {
  if (response === [])
    return;

  let res = response.filter(r => {
    return request.numTravellers < parseInt(r.nb_places_proposes, 10);
  });

  let res2;
  if (response2 !== undefined) {
    res2 = response2.filter(r => {
      return request.numTravellers < parseInt(r.nb_places_proposes, 10);
    });
  }

  let trips1 = res.map(trip => {
    return {
      id: trip.id_covoit,
      source: trip.ville_depart,
      destination: trip.ville_destination,
      departDate: new Date(trip.date_voyage + "T" + trip.heure_voyage),
      price: request.numTravellers * parseInt(trip.prix),
      carrier: trip.proposer.prenom + " " + trip.proposer.nom,
      direct: true,
    }
  });

  if (request.isOneWay || response2 === undefined) {
    return trips1;
  }

  let trips2 = res2.map(trip => {
    return {
      returnDate: new Date(trip.date_voyage + "T" + trip.heure_voyage),
      returnDirect: true,
      returnCarrier: trip.proposer.prenom + " " + trip.proposer.nom,
      returnPrice: request.numTravellers * parseInt(trip.prix),
    }
  });

  let trips = []; 
  trips1.forEach(trip1 => {
    trips2.forEach(trip2 => {
      trips.push(Object.assign(trip1, trip2)); 
    })
  });

  return trips;
}

