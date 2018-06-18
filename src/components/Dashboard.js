import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Link, Redirect, Switch } from "react-router-dom";
import {
  withStyles,
  MuiThemeProvider
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import darkTheme from "../themes/dark";
import Profile from "./Profile";
import Favorites from "./Favorites";
import MyTrips from "./MyTrips";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex"
  },
  tabBar: {
    position: "absolute",
    width: "80%",
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    position: "absolute",
    right: 8,
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    position: "fized",
    zIndex: 0,
    paddingTop: 16,
    backgroundColor: theme.palette.primary.dark,
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      paddingTop: 64,
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  link: {
    textDecoration: "none"
  }
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      selectedSection: 2,
      selectedTab: 0,
    };
  }

  handleSectionChange = selectedSection => () => {
    this.setState({ selectedSection, mobileOpen: false });
  };

  handleTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }

  render() {
    const { classes, match } = this.props;
    const { selectedTab, selectedSection } = this.state;

    let tabs = [];
    if (selectedSection === 0) {
      tabs = [
        <Tab label="Modify Profile"/>,
        <Tab label="Delete Profile"/>
      ];
    } else if (selectedSection === 1) {
      tabs = ["Flights", "Trains", "Buses", "Carpools"].map((tab, i) => {
        return <Tab label={tab}/>
      });
    } else if (selectedSection === 2) {
      tabs = [
        <Tab label="My Carpools"/>,
        <Tab label="Add Carpool"/>
      ];
    }

    const drawer = (
      <div>
        <List>
          <Link to={`${match.url}/favorites`} className={classes.link}>
            <ListItem button onClick={this.handleSectionChange(1)}>
              <ListItemIcon>
                <Icon>favorite</Icon>
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem>
          </Link>
          <Link to={`${match.url}/mytrips`} className={classes.link}>
            <ListItem button onClick={this.handleSectionChange(2)}>
              <ListItemIcon>
                <Icon>directions_car</Icon>
              </ListItemIcon>
              <ListItemText primary="My Trips" />
            </ListItem>
          </Link>
          <Link to={`${match.url}/profile`} className={classes.link}>
            <ListItem button onClick={this.handleSectionChange(0)}>
              <ListItemIcon>
                <Icon>account_box</Icon>
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </Link>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <Tabs
          value={selectedTab}
          onChange={this.handleTabChange}
          className={classes.tabBar}
          fullWidth
        >
          {tabs}
        </Tabs>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={this.handleDrawerToggle}
          className={classes.navIconHide}
        >
          <Icon>menu</Icon>
        </IconButton>
        <MuiThemeProvider theme={darkTheme}>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={"left"}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </MuiThemeProvider>
        <main className={classes.content}>
          {selectedSection !== 0 && <div className={classes.toolbar}/>}
          <Switch>
            <Route path={`${match.path}/profile`}
              render={props => (<Profile {...props}
              />)}
            />
            <Route path={`${match.path}/favorites`}
              render={props => (<Favorites {...props}
                selectedTab={selectedTab}
              />)}
            />
            <Route path={`${match.path}/mytrips`}
              render={props => (<MyTrips {...props}
              />)}
            />
            <Redirect to={`${match.path}/mytrips`}/>
          </Switch>
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
