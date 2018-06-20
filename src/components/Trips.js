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
import CircularProgress from '@material-ui/core/CircularProgress';
import queryString from "query-string";
import { format } from "date-fns";
import SearchForm from "./SearchForm";
import darkTheme from "../themes/dark";
import Page404 from "./Page404";
import TripList from "./TripList";
import { toISO } from "../helpers";
import { getTrips } from "../api/trips";

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
  },
  tripsProgress: {
    display: "block",
    marginTop: "20%",
    margin: "auto",
  }
});

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      request: {},
      response: []
    }
  }

  componentDidMount() {
    const inReq = this.getRequestFromUrl();
    const { navValue } = inReq;
    const instance = getTrips(inReq, navValue);
    if (instance !== null) {
      instance.then((response) => {
        this.setState({ response, loading: false });
      }).catch(e => {
        this.setState({ response: [], loading: false });
        console.log(e); 
      });
    }
    this.setState({ request: inReq });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match !== prevProps.match ||
      this.props.location !== prevProps.location) {

      const inReq = this.getRequestFromUrl();
      const { navValue } = inReq;
      const instance = getTrips(inReq, navValue);
      if (instance !== null) {
        instance.then((response) => {
          this.setState({ response, loading: false });
        }).catch(e => {
          this.setState({ response: [], loading: false });
          console.log(e); 
        });
      }

      this.setState({ request: inReq });
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
      cabinClass: query.cabinclass && parseInt(query.cabinclass, 10),
      city: query.city
    }
    return request;
  }

  render() {
    const { classes, isLoggedIn, user } = this.props;
    const { request, response, loading } = this.state;

    let trips;
    if (loading) {
      trips = <CircularProgress size={128} className={classes.tripsProgress}/>;
    } else {
      if (response === undefined || response === null || response.length === 0) {
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
          user={user}
        />;
      }
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
  user: PropTypes.object,
};

export default compose(
  withStyles(styles),
  withWidth(),
)(Trips);
