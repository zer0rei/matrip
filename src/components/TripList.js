import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import TripCard from "./TripCard";
import { addFavorite } from "../api/trips";

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
      isFavoriteList: []
    }
  }

  componentDidMount() {
    let newState = Object.assign({}, this.state);
    this.props.trips.forEach((trip, i) => {
      if (this.props.isLoggedIn) {
        newState.isFavoriteList[i] = false;
      }
    });
    this.setState(newState);
  }

  handleFavoriteChange = key => () => {
    let newState = Object.assign({}, this.state);
    const prevFav = this.state.isFavoriteList[key];
    newState.isFavoriteList[key] = prevFav ? false : true;
    
    const instance = addFavorite(this.props.user.id, this.props.trips[key].id, this.props.type);
    if (instance !== null) {
      instance.then((response) => {
        console.log(response);
        this.setState(newState); 
      }).catch(e => {
        console.log(e); 
        this.setState(newState); 
      });
    }
  }

  render() {
    const { classes, trips, type } = this.props;
    const { isFavoriteList } = this.state;
    const triplist = trips.map((trip, i) => {
      return (
        <TripCard
          trip={trip}
          type={type}
          key={i}
          favorite={isFavoriteList[i]}
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
  isLoggedIn: PropTypes.bool,
};

export default withStyles(styles)(TripList);
