import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';

const styles = theme => ({
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
  searchButton: {
    marginTop: 16
  }
});

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navValue: 'flights',
      isOneWay: true,
      departDate: new Date(),
      returnDate: new Date(),
    };
  }

  handleNavChange = (event, navValue) => {
    this.setState({ navValue });
  }
  
  handleOneWayChange = () => event => {
    this.setState({ isOneWay: event.target.checked });
  }

  handleDepartDateChange = (date) => {
    this.setState({ departDate: date });
  }

  handleReturnDateChange = (date) => {
    this.setState({ returnDate: date });
  }

  render() {
    const { classes } = this.props;
    const { navValue, isOneWay, departDate, returnDate } = this.state;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                value='flights' label='Flights'/>
              <BottomNavigationAction classes={{selected: classes.navElemSelected,
                root: classes.navElem}}
                value='trains' label='Trains'/>
              <BottomNavigationAction classes={{selected: classes.navElemSelected,
                root: classes.navElem}}
                value='buses' label='Buses'/>
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
          <Grid item xs={6}>
            <TextField
              id='cabin'
              label='Cabin Class & Travellers'
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOneWay}
                  onChange={this.handleOneWayChange()}
                  color='white'
                />
              }
              label='One way'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              id='depart'
              label='Depart'
              fullWidth
              value={departDate}
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.handleDepartDateChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              id='return'
              label='Return'
              fullWidth
              disabled={isOneWay}
              value={returnDate}
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.handleReturnDateChange}
            />
          </Grid>
          <Grid item xs={12} sm={8} className={classes.searchButton}>
            <Button type='submit' color='secondary' variant='contained' fullWidth>
              Search {navValue}
            </Button>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    )
  }
}

SearchForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchForm);
