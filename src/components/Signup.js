import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import { subYears, isBefore } from 'date-fns'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import {
  validateName,
  validatePhoneNumber,
  validateEmail,
  validatePassword
} from '../helpers';

const styles = {
  signupButton: {
    marginTop: 16
  }
};

function validate(value, type) {
  switch(type) {
    case 'firstName':
      return validateName(value);
    case 'lastName':
      return validateName(value);
    case 'phoneNumber':
      if (value)
        return validatePhoneNumber(value);
      else
        return true;
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    default:
      return -1;
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      birthdate: null,
      sex: '',
      errors: {}
    };
  }

  handleChange = type => event => {
    let newState = Object.assign({}, this.state);

    const value = event.target.value;
    let isValid = false;

    if (type === 'confirmPassword')
      isValid = (value === this.state.password);
    else
      isValid = validate(value, type);

    if (isValid)
      newState.errors[type] = false;

    newState[type] = value;
    this.setState(newState);
  }

  handleBirthdateChange = date => {
    if (isBefore(date, subYears(new Date(), 16)))
      this.setState({ birthdate: date });
  }

  handleSexChange = event => {
    this.setState({ sex: event.target.value });
  }

  validateSignup = () => {
    let newState = Object.assign({}, this.state);
    let isValid = true;

    ['firstName', 'lastName', 'email', 'phoneNumber', 'password'].forEach(type => {
      if (!validate(this.state[type], type)) {
        newState.errors[type] = true;
        isValid = false;
      } else
        newState.errors[type] = false;
    });

    if (this.state.password !== this.state.confirmPassword) {
      newState.errors['confirmPassword'] = true;
      isValid = false;
    } else
      newState.errors['confirmPassword'] = false;

    this.setState(newState);

    if (isValid) {
      // TODO: request + redirect
    }

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
      errors
    } = this.state;
    const { classes } = this.props;
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
            <Typography
              align='center'
              variant='headline'
            >
              Signup
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id='first-name'
              label='First Name'
              value={firstName}
              onChange={this.handleChange('firstName')}
              error={errors['firstName']}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id='last-name'
              label='Last Name'
              value={lastName}
              onChange={this.handleChange('lastName')}
              error={errors['lastName']}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='email'
              label='Email'
              type='email'
              value={email}
              onChange={this.handleChange('email')}
              error={errors['email']}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='phone-number'
              label='Phone Number'
              value={phoneNumber}
              onChange={this.handleChange('phoneNumber')}
              error={errors['phoneNumber']}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Tooltip id='password-tooltip' title="Minimum eight characters, at least one letter and one number">
              <TextField
                id='password'
                label='Password'
                type='password'
                value={password}
                onChange={this.handleChange('password')}
                error={errors['password']}
                fullWidth
                required
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='confirm-password'
              label='Confirm Password'
              type='password'
              value={confirmPassword}
              onChange={this.handleChange('confirmPassword')}
              error={errors['confirmPassword']}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Tooltip id='birthdate-tooltip' title="Minimum 16 years old">
              <DatePicker
                id='birthdate'
                label='Birthdate'
                fullWidth
                value={birthdate}
                onChange={this.handleBirthdateChange}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth >
              <InputLabel htmlFor='sex'>Sex</InputLabel>
              <Select
                value={sex}
                onChange={this.handleSexChange}
                inputProps={{
                  name: 'sex',
                  id: 'sex',
                }}
              >
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={10} sm={8}>
            <Button
              type='submit'
              color='secondary'
              variant='contained'
              fullWidth
              onClick={this.validateSignup}
              className={classes.signupButton}
            >
              Signup
            </Button>
          </Grid>
          <Grid item xs={10}>
            <Typography align='center' variant='button'>
              already a member ? <Link to='/login'>Login</Link>
            </Typography>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
