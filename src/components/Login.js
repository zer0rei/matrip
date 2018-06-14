import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {validateEmail, validatePassword} from '../helpers'

const styles = {
  loginButton: {
    marginTop: 16
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }

  handleEmailChange = event => {
    let newState = Object.assign({}, this.state);

    if (validateEmail(this.target.value)) 
      newState.errors['email'] = false;

    newState.email = event.target.value;
    this.setState(newState);
  }

  handlePasswordChange = event => {
    let newState = Object.assign({}, this.state);

    if (validatePassword(this.target.value)) 
      newState.errors['password'] = false;

    newState.password = event.target.value;
    this.setState(newState);
  }

  handleLogin = () => {
    let newState = Object.assign({}, this.state);
    let isValid = true;

    if (!validateEmail(this.state.email)) {
      newState.errors['email'] = true;
      isValid = false;
    } else
      newState.errors['email'] = false;

    if (!validatePassword(this.state.password)) {
      newState.errors['password'] = true;
      isValid = false;
    } else
      newState.errors['password'] = false;

    this.setState(newState);

    if (isValid) {
      // TODO: request + redirect
    }
  }

  render() {
    const { email, password, errors } = this.state;
    const { classes } = this.props;
    return (
      <Grid
        container
        spacing={16}
        alignItems='center'
        direction='row'
        justify='center'
      >
        <Grid item xs={12}>
          <Typography
            align='center'
            variant='headline'
          >
            Login
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            id='email'
            label='Email'
            type='email'
            value={email}
            onChange={this.handleEmailChange}
            error={errors['email']}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            id='Password'
            label='Password'
            type='password'
            value={password}
            onChange={this.handlePasswordChange}
            error={errors['password']}
            fullWidth
          />
        </Grid>
        <Grid item xs={10} md={6}>
          <Button
            type='submit'
            color='secondary'
            variant='contained'
            fullWidth
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            Login
          </Button>
        </Grid>
        <Grid item xs={10}>
          <Typography align='center' variant='button'>
            not a member ? <Link to='/signup'>Signup</Link>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
