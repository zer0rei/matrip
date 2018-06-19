import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { validateEmail, validatePassword } from "../helpers"
import login from "../api/login";

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
    let newErrors = Object.assign({}, this.state.errors);

    if (validateEmail(event.target.value)) 
      newErrors["email"] = false;

    this.setState({ email: event.target.value, errors: newErrors });
  }

  handlePasswordChange = event => {
    let newErrors = Object.assign({}, this.state.errors);

    if (validatePassword(event.target.value))
      newErrors["password"] = false;

    this.setState({ password: event.target.value, errors: newErrors });
  }

  handleLogin = () => {
    const { email, password } = this.state;

    let newErrors = Object.assign({}, this.state.errors);
    let isValid = true;

    if (!validateEmail(email)) {
      newErrors["email"] = true;
      isValid = false;
    } else
      newErrors["email"] = false;

    if (!validatePassword(password)) {
      newErrors["password"] = true;
      isValid = false;
    } else
      newErrors["password"] = false;

    if (isValid) {
      const instance = login(email, password);

      if (instance) {
        instance.then((response) => {
          if (typeof response === 'object' && response !== null) {
            this.props.onLoggedIn(response);
          }
          else {
            newErrors["email"] = true;
            newErrors["password"] = true;
            this.setState({ error: newErrors });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }

    this.setState({ errors: newErrors });
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
