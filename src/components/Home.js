import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
  nav: {
    backgroundColor: 'transparent',
  },
  navElemSelected: {
    color: 'white',
    borderRadius: 24,
    borderWidth: 1,
    padding: 8,
    paddingRight: 16,
    paddingLeft: 16,
    borderStyle: 'solid',
    borderColor: 'white'
  },
  navElem: {
    border: 'none',
    padding: 8,
    paddingRight: 20,
    paddingLeft: 20
  },
  container: {
    backgroundColor: blueGrayTransparent,
    padding: 32,
    borderRadius: 16
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navValue: 0,
    };
  }

  handleNavChange = (event, navValue) => {
    this.setState({ navValue });
  };

  render() {
    const { classes, height, width } = this.props;
    const { navValue } = this.state;
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
          <Grid item xs={10} md={4}>
            <Paper className={classes.container}>
              <Grid
                container
                spacing={16}
                alignItems='center'
                direction='row'
                justify='center'
              >
                <Grid item xs={12}>
                  <BottomNavigation
                    value={navValue}
                    className={classes.nav}
                    onChange={this.handleNavChange}
                    showLabels
                  >
                    <BottomNavigationAction classes={{selected: classes.navElemSelected,
                      root: classes.navElem}}
                      label='Flights'/>
                    <BottomNavigationAction classes={{selected: classes.navElemSelected,
                      root: classes.navElem}}
                      label='Trains'/>
                    <BottomNavigationAction classes={{selected: classes.navElemSelected,
                      root: classes.navElem}}
                      label='Buses'/>
                  </BottomNavigation>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id='source'
                    label='From'
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id='destination'
                    label='To'
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                      color: 'secondary'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id='depart'
                    label='Depart'
                    type='datetime'
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id='return'
                    label='Return'
                    type='datetime'
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id='cabin'
                    label='Cabin Class & Travellers'
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button type='submit' color='secondary' variant='contained' fullWidth>
                    Search
                  </Button>
                </Grid>
              </Grid>
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
  width: PropTypes.number
};

export default withStyles(styles)(Home);
