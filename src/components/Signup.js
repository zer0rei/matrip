import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import { subYears, isBefore } from "date-fns"
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import DatePicker from "material-ui-pickers/DatePicker";
import {
  validateName,
  validatePhoneNumber,
  validateEmail,
  validatePassword
} from "../helpers";
import { signup } from "../api/signup";
import { modifyUser } from "../api/signup";

const styles = {
  signupButton: {
    marginTop: 16
  },
  userModifAlert: {
    color: "green"
  }
};

function validate(value, type) {
  switch(type) {
    case "firstName":
      return validateName(value);
    case "lastName":
      return validateName(value);
    case "phoneNumber":
      return validatePhoneNumber(value);
    case "email":
      return validateEmail(value);
    case "password":
      return validatePassword(value);
    default:
      return -1;
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      birthdate,
      sex
    } = (props.variant === "modify") ? props.user : {};

    this.state = {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phoneNumber: phoneNumber || "",
      password: "",
      confirmPassword: "",
      birthdate: birthdate || null,
      sex: sex || "",
      errors: {},
      userModified: false,
    };
  }

  handleChange = type => event => {
    let newErrors = Object.assign({}, this.state.errors);

    const value = event.target.value;
    let isValid = false;

    if (type === "confirmPassword")
      isValid = (value === this.state.password);
    else
      isValid = validate(value, type);

    if (isValid)
      newErrors[type] = false;

    this.setState({ [type]: value, errors: newErrors, userModified: false });
  }

  handleBirthdateChange = date => {
    if (isBefore(date, subYears(new Date(), 16)))
      this.setState({ birthdate: date, userModified: false });
  }

  handleSexChange = event => {
    let newErrors = Object.assign({}, this.state.errors);
    newErrors["sex"] = false;
    this.setState({ sex: event.target.value, errors: newErrors, userModified: false });
  }

  validateSignup = () => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      birthdate,
      sex,
      errors
    } = this.state;

    let newErrors = Object.assign({}, this.state.errors);
    let isValid = true;

    ["firstName", "lastName", "email", "phoneNumber"].forEach(type => {
      if (!validate(this.state[type], type)) {
        newErrors[type] = true;
        isValid = false;
      } else
        newErrors[type] = false;
    });

    if (this.props.variant !== "modify") {
      if (!validate(password, "password")) {
        newErrors["password"] = true;
        isValid = false;
      } else
        newErrors["password"] = false;

      if (password !== confirmPassword) {
        newErrors["confirmPassword"] = true;
        isValid = false;
      } else {
        newErrors["confirmPassword"] = false;
      }
    }

    if (sex === "") {
      newErrors["sex"] = true;
      isValid = false;
    }

    if (isValid) {
      const user = {
        lastName,
        firstName,
        phoneNumber,
        sex,
        email,
        password
      };

      let instance;
      if (this.props.variant === "modify") {
        let modUser = {id: this.props.user.id, ...user};
        instance = modifyUser(modUser);
      } else {
        instance = signup(user);
      }

      if (instance) {
        instance.then((response) => {
          if (typeof response === 'object' && response !== null) {
            this.props.onUserUpdate(response);
            if (this.props.variant === "modify") {
              this.setState({ userModified: true });
            }
          }
          if (response === "email exists") {
            newErrors["email"] = true;
            this.setState({ errors: newErrors });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    }

    this.setState({ errors: newErrors });
  }

  render() {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      birthdate,
      sex,
      errors,
      userModified
    } = this.state;
    const { classes, isLoggedIn, variant } = this.props;
    if (isLoggedIn && variant !== "modify") {
      return <Redirect to="/dashboard"/>;
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
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="headline"
            >
              {variant === "modify" ? "Modify User" : "Signup"}
            </Typography>
          </Grid>
          {variant === "modify" && userModified &&
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="subheading"
              className={classes.userModifAlert}
            >
              USER MODIFICATION SUCCEEDED
            </Typography>
          </Grid>
          }
          <Grid item xs={6}>
            <TextField
              id="first-name"
              label="First Name"
              value={firstName}
              onChange={this.handleChange("firstName")}
              error={errors["firstName"]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="last-name"
              label="Last Name"
              value={lastName}
              onChange={this.handleChange("lastName")}
              error={errors["lastName"]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={this.handleChange("email")}
              error={errors["email"]}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="phone-number"
              label="Phone Number"
              value={phoneNumber}
              onChange={this.handleChange("phoneNumber")}
              error={errors["phoneNumber"]}
              fullWidth
              required
            />
          </Grid>
          {variant !== "modify" &&
          <Grid item xs={12} sm={6}>
            <Tooltip
              id="password-tooltip"
              title="Minimum eight characters, at least one letter and one number"
            >
              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={this.handleChange("password")}
                error={errors["password"]}
                fullWidth
                required
              />
            </Tooltip>
          </Grid>
          }
          {variant !== "modify" &&
          <Grid item xs={12} sm={6}>
            <TextField
              id="confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={this.handleChange("confirmPassword")}
              error={errors["confirmPassword"]}
              fullWidth
              required
            />
          </Grid>
          }
          <Grid item xs={6}>
            <Tooltip
              id="birthdate-tooltip"
              title="Minimum 16 years old"
            >
              <DatePicker
                id="birthdate"
                label="Birthdate"
                format="DD/MM/YYYY"
                disableFuture
                openToYearSelection
                fullWidth
                value={birthdate}
                onChange={this.handleBirthdateChange}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required error={errors["sex"]}>
              <InputLabel htmlFor="sex">Sex</InputLabel>
              <Select
                value={sex}
                onChange={this.handleSexChange}
                inputProps={{
                  name: "sex",
                  id: "sex",
                }}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={10} sm={8}>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              fullWidth
              onClick={this.validateSignup}
              className={classes.signupButton}
            >
              {variant === "modify" ? "Modify User" : "Signup"}
            </Button>
          </Grid>
          {variant !== "modify" &&
          <Grid item xs={10}>
            <Typography align="center" variant="button">
              already a member ? <Link to="/login">Login</Link>
            </Typography>
          </Grid>
          }
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  onUserUpdate: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  variant: PropTypes.string,
  user: PropTypes.object
};

export default withStyles(styles)(Login);
