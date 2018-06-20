import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import sha1 from "js-sha1";
import { validatePassword } from "../helpers";
import { modifyPassword } from "../api/signup";

const styles = {
  loginButton: {
    marginTop: 16
  },
  passModifyAlert: {
    color: "green"
  }
};

class PasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      newPassword: "",
      errors: {},
      passwordModified: false
    };
  }

  handleChange = type => event => {
    let newErrors = Object.assign({}, this.state.errors);

    const value = event.target.value;
    let isValid = false;

    if (type === "confirmPassword")
      isValid = (value === this.state.password);
    else
      isValid = validatePassword(value);

    if (isValid)
      newErrors[type] = false;

    this.setState({ [type]: value, errors: newErrors, passwordModified: false });
  }

  validate = () => {
    const { password, confirmPassword, newPassword } = this.state;

    let newErrors = Object.assign({}, this.state.errors);
    let isValid = true;

    if (!validatePassword(password)) {
      newErrors["password"] = true;
      isValid = false;
    } else
      newErrors["password"] = false;

    if (!validatePassword(newPassword)) {
      newErrors["newPassword"] = true;
      isValid = false;
    } else
      newErrors["newPassword"] = false;

    if (password !== confirmPassword) {
      newErrors["confirmPassword"] = true;
      isValid = false;
    } else
      newErrors["confirmPassword"] = false;

    if (isValid) {
      let instance;
      if (sha1(password) === this.props.user.password) {
        instance = modifyPassword(this.props.user.id, newPassword);
      } else {
        newErrors["password"] = true;
        isValid = false;
      }

      if (instance) {
        instance.then((response) => {
          if (typeof response === 'object' && response !== null) {
            this.props.onUserUpdate(response);
            this.setState({ passwordModified: true });
          } else {
            newErrors["newPassword"] = true;
            this.setState({ errors: newErrors });
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
    const {
      password,
      confirmPassword,
      newPassword,
      errors,
      passwordModified
    } = this.state;
    const { classes } = this.props;

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
            Modify Password
          </Typography>
        </Grid>
        {passwordModified &&
        <Grid item xs={12}>
          <Typography
            align="center"
            variant="subheading"
            className={classes.passModifyAlert}
          >
            PASSWORD MODIFICATION SUCCEEDED
          </Typography>
        </Grid>
        }
        <Grid item xs={12} md={8}>
          <TextField
            id="Password"
            label="Old Password"
            type="password"
            value={password}
            onChange={this.handleChange("password")}
            error={errors["password"]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            id="confirmPassword"
            label="Confirm Old Password"
            type="password"
            value={confirmPassword}
            onChange={this.handleChange("confirmPassword")}
            error={errors["confirmPassword"]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={this.handleChange("newPassword")}
            error={errors["newPassword"]}
            fullWidth
          />
        </Grid>
        <Grid item xs={10} md={6}>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            fullWidth
            onClick={this.validate}
            className={classes.loginButton}
          >
            Modify Password
          </Button>
        </Grid>
      </Grid>
    );
  }
}

PasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onUserUpdate: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool
};

export default withStyles(styles)(PasswordForm);
