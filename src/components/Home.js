import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BgImage from '../images/background.png';

const styles = {
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
  }
};

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
                <BottomNavigationAction label='Flights'/>
                <BottomNavigationAction label='Trains'/>
                <BottomNavigationAction label='Buses'/>
              </BottomNavigation>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id='source'
                label='From'
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id='destination'
                label='To'
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='depart'
                label='Depart'
                type='date'
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='return'
                label='Return'
                type='date'
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id='cabin'
                label='Cabin Class & Travellers'
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button type='submit' color='secondary' variant='contained' fullWidth>
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};

export default withStyles(styles)(Home);
