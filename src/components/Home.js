import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SearchForm from './SearchForm'
import Login from './Login'
import Signup from './Signup'
import Page404 from './Page404'
import BgImage from '../images/background.png';
import theme from '../themes/default'

const blueGrayTransparent = 'rgba(84, 110, 122, 0.8)';

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.palette.primary.main,
      light: 'white'
    },
    secondary: theme.palette.secondary,
    error: theme.palette.error,
    type: 'dark'
  }
});

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
    backgroundImage: `url(${BgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    zIndex: -1
  },
  container: {
    backgroundColor: blueGrayTransparent,
    padding: 32,
    borderRadius: 16
  }
});

class Home extends Component {
  renderSwitch(param) {
    switch(param) {
      case 'login':
        return <Login/>;
      case 'signup':
        return <Signup/>;
      case '404':
        return <Page404/>;
      default:
        return <SearchForm/>;
    }
  }

  render() {
    const { classes, height, width, show } = this.props;
    return (
      <MuiThemeProvider theme={darkTheme}>
        <Grid
          container
          spacing={16}
          className={classes.root}
          style={{height, width}}
          alignItems='center'
          direction='row'
          justify='center'
        >
          <Grid item xs={11} md={5}>
            <Paper className={classes.container}>
              {this.renderSwitch(show)}
            </Paper>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  show: PropTypes.string
};

export default withStyles(styles)(Home);
