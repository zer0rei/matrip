import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import theme from "../themes/default";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Trips from "./Trips";

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  title: {
    fontFamily: "'Pacifico', cursive",
    fontSize: "1.5em"
  }
};

const PrivateRoute = ({ isAuthenticated, component: Component, componentProps, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Component {...props} {...componentProps} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: {},
      anchorEl: null,
      width: 0,
      height: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.setState({ isLoggedIn: false, user: {} });
    this.handleClose();
  };

  handleUserUpdate = (user) => {
    if (user !== {})
      this.setState({ isLoggedIn: true, user });
    else
      this.setState({ isLoggedIn: false, user });
  };

  render() {
    const { classes } = this.props;
    const {
      isLoggedIn,
      user,
      favorites,
      anchorEl,
      height,
      width
    } = this.state;
    const open = Boolean(anchorEl);
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar position="sticky">
              <Toolbar>
                <Typography
                  variant="title"
                  color="inherit"
                  className={[classes.flex, classes.title].join(" ")}
                >
                  <Link 
                    to="/"
                    style={{textDecoration: "none", color: "inherit"}}
                  >
                    matrip
                  </Link>
                </Typography>
                {isLoggedIn ? (
                  <div>
                    <IconButton
                      aria-owns={open ? "menu-appbar" : null}
                      aria-haspopup="true"
                      onClick={this.handleMenu}
                      color="inherit"
                    >
                      <Icon>account_circle</Icon>
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={open}
                      onClose={this.handleClose}
                    >
                      <MenuItem onClick={this.handleClose}>
                        <Link
                          to="/dashboard"
                          style={{textDecoration: "none", color: "inherit"}}
                        >
                          Dashboard
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={this.handleLogout}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </div>
                ):(
                  <Link
                    to="/login"
                    style={{textDecoration: "none", color: "inherit"}}
                  >
                    <Button color="inherit">Login</Button>
                  </Link>
                )}
              </Toolbar>
            </AppBar>
            <Switch>
              <Route exact path="/" 
                render={props => (<Home {...props}
                  height={height}
                  width={width}
                />)}
              />
              <Route path="/login"
                render={props => (<Home {...props}
                  height={height}
                  width={width}
                  onUserUpdate={this.handleUserUpdate}
                  isLoggedIn={isLoggedIn}
                  show="login"
                />)}
              />
              <Route path="/signup"
                render={props => (<Home {...props}
                  height={height}
                  width={width}
                  onUserUpdate={this.handleUserUpdate}
                  isLoggedIn={isLoggedIn}
                  show="signup"
                />)}
              />
              <PrivateRoute
                isAuthenticated={isLoggedIn}
                path="/dashboard"
                component={Dashboard}
                componentProps={{ user, onUserUpdate: this.handleUserUpdate, isLoggedIn }}
              />
              {["flights", "trains", "buses", "carpools"].map((type, i) => {
                  return (
                    <Route
                      path={`/trips/${type}/:from/:to`}
                      render={props => (<Trips {...props}
                        isLoggedIn={isLoggedIn}
                        user={user}
                      />)}
                      key={i}
                    />
                  )
                })
              }
              <Route
                render={props => (<Home {...props}
                  height={height}
                  width={width}
                  show="404"
                />)}
              />
            </Switch>
          </div>
        </MuiThemeProvider>
      </Router>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
