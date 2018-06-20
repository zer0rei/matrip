import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import TripList from "./TripList";
import Page404 from "./Page404";
import { getFavorites } from "../api/trips";

const styles = theme => ({
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

class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: {},
      loading: true
    };
  }

  componentDidMount() {
    const instance = getFavorites(this.props.user.id);
    if (instance !== null) {
      instance.then((favorites) => {
        this.setState({ favorites, loading: false });
      }).catch(e => {
        this.setState({ favorites: [], loading: false });
        console.log(e); 
      });
    }
  }

  render() {
    const { favorites, loading } = this.state;
    const { classes, selectedTab, isLoggedIn, user } = this.props;

    let page404 = <div className={classes.notFoundContainer}>
      <Page404
        message="Sorry, we couldn't process your request, please try again"
      />
    </div>;

    let renderedFavorites;
    if (loading) {
      renderedFavorites = <CircularProgress size={128} className={classes.tripsProgress}/>;
    } else {
      if (favorites === undefined || favorites === null || favorites.length === 0) {
        renderedFavorites = page404;
      } else {
        if (selectedTab === 0) {
          renderedFavorites = favorites.flights ?
            <TripList
              trips={favorites.flights}
              type="flights"
              isLoggedIn={isLoggedIn}
              user={user}
            /> : page404;
        } else if (selectedTab === 1) {
          renderedFavorites = favorites.trains ?
            <TripList
              trips={favorites.trains}
              type="trains"
              isLoggedIn={isLoggedIn}
              user={user}
            /> : page404;
        } else if (selectedTab === 2) {
          renderedFavorites = favorites.buses ?
            <TripList
              trips={favorites.buses}
              type="buses"
              isLoggedIn={isLoggedIn}
              user={user}
            /> : page404;
        } else if (selectedTab === 3) {
          renderedFavorites = favorites.carpools ?
            <TripList
              trips={favorites.carpools}
              type="carpools"
              isLoggedIn={isLoggedIn}
              user={user}
            /> : page404;
        }
      }
    }
    return (
      <div>
        {renderedFavorites}
      </div>
    );
  }
}

Favorites.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  selectedTab: PropTypes.number,
};

export default withStyles(styles)(Favorites);
