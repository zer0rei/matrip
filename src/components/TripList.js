import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import TripCard from "./TripCard";

const styles = {
  root: {
    flexGrow: 1,
    width: "100%"
  },
};

const TripList = props => {
  const { classes, trips, type } = props;
  const triplist = trips.map((trip, i) => {
    return <TripCard trip={trip} type={type} key={i}/>  
  });
  return (
    <div className={classes.root}>
      {triplist}
    </div>
  );
}

TripList.propTypes = {
  classes: PropTypes.object.isRequired,
  trips: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
};

export default withStyles(styles)(TripList);
