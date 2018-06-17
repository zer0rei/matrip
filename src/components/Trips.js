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
import SearchForm from "./SearchForm";
import darkTheme from "../themes/dark";
import Page404 from "./Page404";
import TripList from "./TripList";
import { toISO } from "../helpers";

const drawerWidth = 350;

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
    // TODO: request
    const response = [{
      source: "RAK",
      destination: "ORY",
      departDate: new Date("2018-06-18T03:00:00"),
      arrivalDate: new Date("2018-06-18T06:00:00"),
      price: 1185.0,
      direct: false,
    },
    {
      source: "RAK",
      destination: "ORY",
      departDate: new Date("2018-06-18T02:30:00"),
      returnDate: new Date("2018-09-18T06:30:00"),
      price: 1463.0,
      direct: true,
      returnDirect: false,
    }];
    this.setState({ request, response });
  }

  render() {
    const { classes } = this.props;
    const { request, response } = this.state;

    let trips;
    if (response === undefined || response.length === 0) {
      trips = <div className={classes.notFoundContainer}>
        <Page404
          message="Sorry, we couldn't process your request, please try again"
        />
      </div>;
    } else {
      trips = <TripList trips={response} type={request.navValue}/>;
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
};

export default compose(
  withStyles(styles),
  withWidth(),
)(Trips);
