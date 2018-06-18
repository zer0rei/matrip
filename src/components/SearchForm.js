import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import { addMinutes, addDays, isAfter, format } from "date-fns"
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DatePicker from "material-ui-pickers/DatePicker";
import DateTimePicker from "material-ui-pickers/DateTimePicker";
import axios from "axios";
import PlaceInput from "./PlaceInput";
import { BACKEND_API } from "../config";

function getPlaceSuggestions(query, type, callback) {
  if (type === "flights") {
    axios({
      method: 'post',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/suggestions.php`,
      data: {query: query},
    })
    .then((response) => {
      let places = response.data.Places.map(place => {
        return {
          nom: place.PlaceId
        }
      });
      callback(places);
    })
    .catch((error) => {
      callback([]);
      console.log(error);
    });
  } else if (type === "trains") { 
    axios({
      method: 'get',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/gares.php`,
    })
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      callback([]);
      console.log(error);
    });
  } else if (type === "buses") {
    axios({
      method: 'get',
      url: `${BACKEND_API}/TRANSPORTS_APP/controller/stations.php`,
    })
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      callback([]);
      console.log(error);
    });
  } else if (type === "carpools") {
    getCitySuggestions(callback);
  }
}

function getCitySuggestions(callback) {
  axios({
    method: 'get',
    url: `${BACKEND_API}/TRANSPORTS_APP/controller/villes.php`,
  })
  .then((response) => {
    callback(response.data);
  })
  .catch((error) => {
    callback([]);
    console.log(error);
  });
}

const styles = theme => ({
  nav: {
    backgroundColor: "transparent",
  },
  navElemSelected: {
    color: "white",
    borderRadius: 24,
    borderWidth: 1,
    padding: 8,
    paddingRight: 12,
    paddingLeft: 12,
    borderStyle: "solid",
    borderColor: "white"
  },
  navElem: {
    border: "none"
  },
  searchButton: {
    marginTop: 16
  }
});

class SearchForm extends Component {
  constructor(props) {
    super(props);

    const {
      navValue,
      source,
      destination,
      city,
      numTravellers,
      isOneWay,
      departDate,
      returnDate,
      cabinClass
    } = props.default || {};

    this.state = {
      navValue: navValue || "flights",
      source: source || "",
      destination: destination || "",
      city: city || "",
      suggestions: [],
      numTravellers: numTravellers || 1,
      isOneWay: isOneWay !== undefined ? isOneWay : true,
      departDate: departDate || addMinutes(new Date(), 30),
      returnDate: returnDate || addDays(new Date(), 1),
      cabinClass: cabinClass !== undefined ? cabinClass : 0,
      cabinClassList: ["Economy", "Business", "First Class"],
      isRequestValid: false,
      errors: {}
    };
  }

  suggestionsCallback = (response) => {
    let suggestions = response.map((s) => {
      return {label: s.nom};
    });
    this.setState({ suggestions });
  }

  handleNavChange = (event, navValue) => {
    this.setState({ navValue, isRequestValid: false });
    if (navValue === "flights") {
      this.setState({cabinClassList: ["Economy", "Business", "1st Class"]});
    } else if (navValue === "trains") {
      this.setState({cabinClassList: ["2nd Class", "1st Class"]});
    }
  }
  
  handlePlaceChange = type => value => {
    let newErrors = Object.assign({}, this.state.errors);
    this.setState({isRequestValid: false});
    if (value !== "") {
      if (type === "source" || type === "city") {
        newErrors[type] = false;
      }
      if (type === "destination" && value !== this.state.source) {
        newErrors[type] = false; 
      }
    }

    if (type === "city") {
      getCitySuggestions(this.suggestionsCallback);
    } else {
      getPlaceSuggestions(
        value,
        this.state.navValue,
        this.suggestionsCallback
      );
    }

    this.setState({[type]: value, errors: newErrors});
  }

  handleCabinClassChange = event => {
    this.setState({ cabinClass: event.target.value, isRequestValid: false });
  }

  handleNumTravellersChange = event => {
    let num = event.target.value;
    if (num >= 1 && num <= 6)
      this.setState({ numTravellers: Math.floor(num), isRequestValid: false });
  }

  handleOneWayChange = event => {
    this.setState({ isOneWay: event.target.checked, isRequestValid: false });
  }

  handleDepartDateChange = (date) => {
    if (isAfter(date, new Date()))
      this.setState({ departDate: date, isRequestValid: false });
  }

  handleReturnDateChange = (date) => {
    if (isAfter(date, new Date()))
      this.setState({ returnDate: date, isRequestValid: false });
  }

  validateSearch = () => {
    let newState = Object.assign({}, this.state);
    let isValid = true;

    if (this.state.navValue === "buses") {
      if (this.state.city === "") {
        newState.errors["city"] = true;
        isValid = false;
      }
    }

    if (this.state.source === "") {
      newState.errors["source"] = true;
      isValid = false;
    }

    if (this.state.destination === "") {
      newState.errors["destination"] = true;
      isValid = false;
    }

    if (this.state.destination === this.state.source) {
      newState.errors["destination"] = true;
      isValid = false;
    }

    if (isValid) {
      newState.isRequestValid = true;
    }

    this.setState(newState);
  }

  render() {
    const { classes, variant } = this.props;
    const {
      navValue,
      source,
      destination,
      city,
      suggestions,
      numTravellers,
      isOneWay,
      departDate,
      returnDate,
      cabinClass,
      cabinClassList,
      isRequestValid,
      errors
    } = this.state;

    const datePicker = (date, handle, isReturn=false) => {
      if (navValue === "flights") {
        return (
          <DatePicker
            id={isReturn ? "return" : "depart"}
            label={isReturn ? "Return" : "Depart"}
            fullWidth
            disablePast
            value={date}
            disabled={isReturn && isOneWay}
            InputLabelProps={{
              shrink: true
            }}
            onChange={handle}
          />
        )
      }

      return (
        <DateTimePicker
          id={isReturn ? "return" : "depart"}
          label={isReturn ? "Return" : "Depart"}
          fullWidth
          disablePast
          ampm={false}
          value={date}
          disabled={isReturn && isOneWay}
          InputLabelProps={{
            shrink: true
          }}
          onChange={handle}
        />
      )
    };

    let redirect = null;
    if (isRequestValid) {
      const query = `?numtravellers=${numTravellers}` +
        `&isoneway=${isOneWay}` +
        `&departdate=${format(departDate, "DDMMYYHHmm")}` +
        (isOneWay ? `` : `&returndate=${format(returnDate, "DDMMYYHHmm")}`) +
        (((navValue === "flights") || (navValue === "trains")) ? `&cabinclass=${cabinClass}` : ``) +
        ((navValue === "buses") ? `&city=${city}` : ``);

      redirect = <Redirect to={`/trips/${navValue}/${source}/${destination}` + query}/>; 

      if (variant !== 'sidebar')
        return redirect;
    }
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid
          container
          spacing={16}
          alignItems="center"
          direction="row"
          justify="center"
        >
          {isRequestValid && variant === 'sidebar' && redirect}
          <Grid item xs={12}>
            <BottomNavigation
              value={navValue}
              className={classes.nav}
              onChange={this.handleNavChange}
              showLabels
            >
            {["flights", "trains", "buses", "carpools"].map((type, i) => {
              return (
                <BottomNavigationAction
                  classes={{
                    selected: classes.navElemSelected,
                    root: classes.navElem
                  }}
                  value={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  key={i}
                />
              )
            })}
            </BottomNavigation>
          </Grid>
          <Grid item xs={12} sm={variant === "sidebar" ? 12 : 6}>
            <PlaceInput
              id="source"
              label="From"
              suggestions={suggestions}
              onChange={this.handlePlaceChange("source")}
              value={source}
              fullWidth
              error={errors["source"]}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12} sm={variant === "sidebar" ? 12 : 6}>
            <PlaceInput
              id="destination"
              label="To"
              suggestions={suggestions}
              onChange={this.handlePlaceChange("destination")}
              value={destination}
              fullWidth
              error={errors["destination"]}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={variant === "sidebar" ? 12 : 6}>
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
          <Grid item xs={variant === "sidebar" ? 12 : 6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOneWay}
                  onChange={this.handleOneWayChange}
                  color="default"
                />
              }
              label="One way"
            />
          </Grid>
          <Grid item xs={variant === "sidebar" ? 12 : 6}>
            {datePicker(departDate, this.handleDepartDateChange)}
          </Grid>
          <Grid item xs={variant === "sidebar" ? 12 : 6}>
            {datePicker(returnDate, this.handleReturnDateChange, true)}
          </Grid>
          {(navValue === "flights" || navValue === "trains") &&
          <Grid item xs={variant === "sidebar" ? 12 : 6}>
            <FormControl fullWidth >
              <InputLabel htmlFor="cabinClass" shrink>
                Cabin Class
              </InputLabel>
              <Select
                value={cabinClass}
                onChange={this.handleCabinClassChange}
                inputProps={{
                  name: "cabinClass",
                  id: "cabinClass",
                }}
              >
                {cabinClassList.map((cabin, i) => {
                  return (
                    <MenuItem value={i} key={i.toString()}>
                      {cabin}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          }
          {(navValue === "buses") &&
          <Grid item xs={6} sm={variant === "sidebar" ? 12 : 6}>
            <PlaceInput
              id="city"
              label="City"
              suggestions={suggestions}
              onChange={this.handlePlaceChange("city")}
              value={city}
              fullWidth
              error={errors["city"]}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          }
          <Grid item xs={variant === "sidebar" ||
            (navValue === "carpools") ? 10 : 6} md={6}
          >
            <Button
              type="submit"
              color="secondary"
              variant="contained"
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
  variant: PropTypes.string,
  default: PropTypes.object,
};

export default withStyles(styles)(SearchForm);
