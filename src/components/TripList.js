import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import TripCard from "./TripCard";

const styles = {
  root: {
    flexGrow: 1,
    width: "100%"
  },
};

class TripList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: []
    }
  }

  componentDidMount() {
    let newState = Object.assign({}, this.state);
    this.props.trips.forEach((trip, i) => {
      if (this.props.isLoggedIn) {
        newState.favorites[i] = false;
      }
    });
    this.setState(newState);
  }

  handleFavoriteChange = key => () => {
    let newState = Object.assign({}, this.state);
    const prevFav = this.state.favorites[key];
    newState.favorites[key] = prevFav ? false : true;
    this.setState(newState); 
  }

  render() {
    const { classes, trips, type } = this.props;
    const { favorites } = this.state;
    const triplist = trips.map((trip, i) => {
      return (
        <TripCard
          trip={trip}
          type={type}
          key={i}
          favorite={favorites[i]}
          onFavoriteChange={this.handleFavoriteChange(i)}
        />  
      )
    });
    return (
      <div className={classes.root}>
        {triplist}
      </div>
    );
  }
}

TripList.propTypes = {
  classes: PropTypes.object.isRequired,
  trips: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default withStyles(styles)(TripList);
