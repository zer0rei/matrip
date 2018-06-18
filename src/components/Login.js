import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { validateEmail, validatePassword } from "../helpers"
import { BACKEND_API } from "../config";

const styles = {
  loginButton: {
    marginTop: 16
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  handleEmailChange = event => {
    let newState = Object.assign({}, this.state);

    if (validateEmail(event.target.value)) 
      newState.errors["email"] = false;

    newState.email = event.target.value;
    this.setState(newState);
  }

  handlePasswordChange = event => {
    let newState = Object.assign({}, this.state);

    if (validatePassword(event.target.value)) 
      newState.errors["password"] = false;

    newState.password = event.target.value;
    this.setState(newState);
  }

  handleLogin = () => {
    const { email, password } = this.state;

    let newState = Object.assign({}, this.state);
    let isValid = true;

    if (!validateEmail(email)) {
      newState.errors["email"] = true;
      isValid = false;
    } else
      newState.errors["email"] = false;

    if (!validatePassword(password)) {
      newState.errors["password"] = true;
      isValid = false;
    } else
      newState.errors["password"] = false;

    if (isValid) {
      axios({
        method: 'post',
        url: `${BACKEND_API}/TRANSPORTS_APP/controller/login.php`,
        data: {
          email: email,
          password: password
        }
      })
      .then((response) => {
        if (response.data.status === true) {
          this.props.onLoggedIn({
            id: response.data.id,
            lastName: response.data.nom,
            firstName: response.data.prenom,
            phoneNumber: response.data.telephone,
            sex: response.data.sexe,
            email: response.data.email,
            password: response.data.password,
          });
        } else {
          console.log(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    this.setState(newState);
  }

  render() {
    const { email, password, errors } = this.state;
    const { isLoggedIn, classes } = this.props;
    if (isLoggedIn) {
      return <Redirect to="/dashboard"/>;
    }
    return (
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
            Login
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={this.handleEmailChange}
            error={errors["email"]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            id="Password"
            label="Password"
            type="password"
            value={password}
            onChange={this.handlePasswordChange}
            error={errors["password"]}
            fullWidth
          />
        </Grid>
        <Grid item xs={10} md={6}>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            fullWidth
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            Login
          </Button>
        </Grid>
        <Grid item xs={10}>
          <Typography align="center" variant="button">
            not a member ? <Link to="/signup">Signup</Link>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  onLoggedIn: PropTypes.func,
  isLoggedIn: PropTypes.bool
};

export default withStyles(styles)(Login);
