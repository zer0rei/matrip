import React, { Component } from "react";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import {
  withStyles,
  MuiThemeProvider
} from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import withWidth from "@material-ui/core/withWidth";
import Drawer from "@material-ui/core/Drawer";
import queryString from "query-string";
import { format } from "date-fns";
import axios from "axios";
import SearchForm from "./SearchForm";
import darkTheme from "../themes/dark";
import Page404 from "./Page404";
import TripList from "./TripList";
import { toISO } from "../helpers";
import { BACKEND_API } from "../config";

const drawerWidth = 380;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%"
  },
  sideBarContainer: {
    backgroundColor: theme.palette.primary.dark,
    padding: 32,
    paddingTop: 96,
    position: "fixed",
    width: drawerWidth,
    zIndex: 0,
    borderRadius: 0
  },
  container: {
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  notFoundContainer: {
    marginTop: "10%",
    padding: "10%"
  }
});

function getFlights(request, callback) {
   axios({
    method: 'post',
    url: `${BACKEND_API}/TRANSPORTS_APP/controller/flights.php`,
    data: {
      src: request.source,
      dst: request.destination,
      departDate: format(request.departDate, "YYYY-MM-DD"),
      returnDate: request.isOneWay ?
        "" : format(request.returnDate, "YYYY-MM-DD"),
    }
  })
  .then((response) => {
    callback(request, response.data);
  })
  .catch((error) => {
    callback(request, []);
    console.log(error);
  });
}

function getTrains(request, callback) {
  let dep = () => {
    return axios({
      method: 'post',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/consulterTrain.php`,
      data: {
        gareDepart: request.source,
        gareDestination: request.destination,
        heureDepart: format(request.departDate, "HH:mm:ss"),
      }
    });
  };

  let ret = () => {
    return request.isOneWay ? null : axios({
      method: 'post',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/consulterTrain.php`,
      data: {
        gareDepart: request.destination,
        gareDestination: request.source,
        heureDepart: format(request.returnDate, "HH:mm:ss"),
      }
    });
  };

  axios.all([dep(), ret()])
  .then(axios.spread(function (depResponse, retResponse) {
    if (request.isOneWay)
      callback(request, depResponse.data);
    else
      callback(request, depResponse.data, retResponse.data);
  }))
  .catch((error) => {
    callback(request, []);
    console.log(error);
  });
}

function getBuses(request, callback) {
  let dep = () => {
    return axios({
      method: 'post',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/consulterBus.php`,
      data: {
        from: request.source,
        to: request.destination,
        ville: request.city
      }
    });
  };

  let ret = () => {
    return axios({
      method: 'post',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/consulterBus.php`,
      data: {
        from: request.destination,
        to: request.source,
        ville: request.city
      }
    });
  };

  axios.all([dep(), ret()])
  .then(axios.spread(function (depResponse, retResponse) {
    if (depResponse.data.status === true && retResponse.data.status === true) {
      if (request.isOneWay)
        callback(request, depResponse.data);
      else
        callback(request, depResponse.data, retResponse.data);
    } else {
      console.log(depResponse.data.message);
      console.log(retResponse.data.message);
    }
  }))
  .catch((error) => {
    callback(request, []);
    console.log(error);
  });
}

function getCarpools(request, callback) {
  let dep = () => {
    return axios({
      method: 'post',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/consulterCovoit.php`,
      data: {
        ville_depart: request.source,
        ville_destination: request.destination,
        date_voyage: format(request.departDate, "YYYY-MM-DD"),
      }
    });
  };

  let ret = () => {
    return request.isOneWay ? null : axios({
      method: 'post',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/consulterCovoit.php`,
      data: {
        ville_depart: request.destination,
        ville_destination: request.source,
        date_voyage: format(request.returnDate, "YYYY-MM-DD"),
      }
    });
  };

  axios.all([dep(), ret()])
  .then(axios.spread(function (depResponse, retResponse) {
    if (request.isOneWay)
      callback(request, depResponse.data);
    else
      callback(request, depResponse.data, retResponse.data);
  }))
  .catch((error) => {
    callback(request, []);
    console.log(error);
  });
}

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: {},
      response: []
    }
  }

  getRequestFromUrl = () => {
    const { match, location } = this.props;
    const type = match.url.split("/")[2];
    const query = queryString.parse(location.search);
    const request = {
      navValue: type,
      source: match.params.from,
      destination: match.params.to,
      numTravellers: parseInt(query.numtravellers, 10),
      isOneWay: query.isoneway === "true",
      departDate: new Date(toISO(query.departdate)),
      returnDate: query.returndate && new Date(toISO(query.returndate)),
      cabinClass: query.cabinclass && parseInt(query.cabinclass, 10)
    }
    return request;
  }

  componentDidMount() {
    const request = this.getRequestFromUrl();
    const { navValue } = request;

    if (navValue === "flights") {
      getFlights(request, this.getFlightsCallback);
    } else if (navValue === "trains") {
      getTrains(request, this.getTrainsCallback);
    } else if (navValue === "buses") {
      getBuses(request, this.getBusesCallback);
    } else if (navValue === "carpools") {
      getCarpools(request, this.getCarpoolsCallback);
    }
  }

  getFlightsCallback = (request, response) => {
  }

  getTrainsCallback = (request, response, response2=undefined) => {
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
        direct: trip.correspondance === "directe",
        carrier: "ONCF",
      }
    });

    if (request.isOneWay || response2 === undefined)
      return trips1;

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

    this.setState({ response: trips });
  }

  getBusesCallback = (request, response, response2=undefined) => {
  }

  getCarpoolsCallback = (request, response, response2=undefined) => {
    let res = response.filter(r => {
      return request.numTravellers < parseInt(r.nb_places_proposes, 10);
    });

    let res2 = response2.filter(r => {
      return request.numTravellers < parseInt(r.nb_places_proposes, 10);
    });

    let trips1 = res.map(trip => {
      return {
        id: trip.id_covoit,
        source: trip.ville_depart,
        destination: trip.ville_destination,
        departDate: new Date(trip.date_voyage + "T" + trip.heure_voyage),
        price: request.numTravellers * trip.prix,
        carrier: trip.proposer.prenom + " " + trip.proposer.nom,
        direct: true,
      }
    });

    if (request.isOneWay || response2 === undefined)
      return trips1;

    let trips2 = res2.map(trip => {
      return {
        returnDate: new Date(trip.date_voyage + "T" + trip.heure_voyage),
        returnDirect: true,
        returnCarrier: trip.proposer.prenom + " " + trip.proposer.nom,
        returnPrice: request.numTravellers * trip.prix,
      }
    });

    let trips = []; 
    trips1.forEach(trip1 => {
      trips2.forEach(trip2 => {
        trips.push(Object.assign(trip1, trip2)); 
      })
    });

    this.setState({ response: trips });
  }

  render() {
    const { classes, isLoggedIn } = this.props;
    const { request, response } = this.state;

    let trips;
    if (response === undefined || response.length === 0) {
      trips = <div className={classes.notFoundContainer}>
        <Page404
          message="Sorry, we couldn't process your request, please try again"
        />
      </div>;
    } else {
      trips = <TripList
        trips={response}
        type={request.navValue}
        isLoggedIn={isLoggedIn}
      />;
    }
    return (
      <div className={classes.root}>
        <Hidden smDown>
          <MuiThemeProvider theme={darkTheme}>
            <Drawer
              variant="permanent"
              classes={{
                paper: classes.sideBarContainer,
              }}
            >
              <SearchForm variant="sidebar" default={request}/>
            </Drawer>
          </MuiThemeProvider>
        </Hidden>
        <div className={classes.container}>
          {trips}
        </div>
      </div>
    );
  }
}

Trips.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default compose(
  withStyles(styles),
  withWidth(),
)(Trips);
