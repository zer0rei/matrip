import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import { addDays, isAfter } from 'date-fns'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import PlaceInput from './PlaceInput';

function getSuggestions(query, type) {
  // TODO: add suggestions
  if (type === 'flights') {
    return [];
  } else if (type === 'trains') {
    return [];
  } else if (type === 'buses') {
    return [];
  }
}

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
      source: '',
      destination: '',
      suggestions: [],
      isOneWay: true,
      cabinClass: 0,
      cabinClassList: ['Economy', 'Business', 'First Class'],
      numTravellers: 1,
      departDate: new Date(),
      returnDate: addDays(new Date(), 1)
    };
  }

  handleNavChange = (event, navValue) => {
    this.setState({ navValue });
    if (navValue === 'flights') {
      this.setState({cabinClassList: ['Economy', 'Business', '1st Class']});
    } else if (navValue === 'trains') {
      this.setState({cabinClassList: ['2nd Class', '1st Class', 'Single Bed']});
    }
  }
  
  handlePlaceChange = type => value => {
    const suggestions = getSuggestions(value, this.state.navValue);
    this.setState({
      [type]: value,
      suggestions: suggestions || []
    });
  }

  handleCabinClassChange = event => {
    this.setState({ cabinClass: event.target.value });
  }

  handleNumTravellersChange = event => {
    let num = event.target.value;
    if (num >= 1 && num <= 6)
      this.setState({ numTravellers: Math.floor(num) });
  }

  handleOneWayChange = event => {
    this.setState({ isOneWay: event.target.checked });
  }

  handleDepartDateChange = (date) => {
    if (isAfter(date, new Date()))
      this.setState({ departDate: date });
  }

  handleReturnDateChange = (date) => {
    if (isAfter(date, new Date()))
      this.setState({ returnDate: date });
  }

  validateSearch = () => {
    // TODO: request + redirect
  }

  render() {
    const { classes } = this.props;
    const {
    navValue,
    source,
    destination,
    suggestions,
    numTravellers,
    cabinClass,
    cabinClassList,
    isOneWay,
    departDate,
    returnDate
    } = this.state;
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
            <PlaceInput
              id='source'
              label='From'
              suggestions={suggestions}
              onChange={this.handlePlaceChange('source')}
              value={source}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PlaceInput
              id='destination'
              label='To'
              suggestions={suggestions}
              onChange={this.handlePlaceChange('destination')}
              value={destination}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="numTravellers"
              label="Travellers"
              value={numTravellers}
              onChange={this.handleNumTravellersChange}
              type="number"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOneWay}
                  onChange={this.handleOneWayChange}
                  color='default'
                />
              }
              label='One way'
            />
          </Grid>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
          {(navValue === 'flights' || navValue === 'trains') &&
          <Grid item xs={6}>
            <FormControl fullWidth >
              <InputLabel htmlFor='cabinClass' shrink >Cabin Class</InputLabel>
              <Select
                value={cabinClass}
                onChange={this.handleCabinClassChange}
                inputProps={{
                  name: 'cabinClass',
                  id: 'cabinClass',
                }}
              >
                {cabinClassList.map((cabin, i) => {
                  return <MenuItem value={i} key={i.toString()}>{cabin}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Grid>
          }
          <Grid item xs={6}>
            <Button
              type='submit'
              color='secondary'
              variant='contained'
              fullWidth
              onClick={this.validateSearch}
              className={classes.searchButton}
            >
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