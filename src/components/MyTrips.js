import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex"
  },
});

class MyTrips extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      </div>
    );
  }
}

MyTrips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyTrips);
