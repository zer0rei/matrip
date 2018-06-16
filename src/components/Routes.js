import React, { Component } from "react";
import PropTypes from "prop-types";
import compose from "recompose/compose";
import {
  withStyles,
  MuiThemeProvider
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import withWidth from "@material-ui/core/withWidth";
import Paper from "@material-ui/core/Paper";
import Drawer from "@material-ui/core/Drawer";
import SearchForm from "./SearchForm";
import darkTheme from "../themes/dark"

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
    zIndex: -1,
    borderRadius: 0
  },
  container: {
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`
    }
  }
});

class Trips extends Component {
  render() {
    const { classes } = this.props;
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
              <SearchForm variant="sidebar"/>
            </Drawer>
          </MuiThemeProvider>
        </Hidden>
        <div className={classes.container}>stuff</div>
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
