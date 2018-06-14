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
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import { subYears, isBefore } from 'date-fns'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';

const styles = {
  signupButton: {
    marginTop: 16
  }
};

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
    };
  }

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  }

  handleBirthdateChange = date => {
    if (isBefore(date, subYears(new Date(), 16)))
      this.setState({ birthdate: date });
  }

  render() {
    const { firstName, lastName, email, phoneNumber, password, confirmPassword, birthdate, sex } = this.state;
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
              id='firstName'
              label='First Name'
              value={firstName}
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id='lastName'
              label='Last Name'
              value={lastName}
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='email'
              label='Email'
              value={email}
              onChange={this.handleEmailChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='phoneNumber'
              label='Phone Number'
              value={phoneNumber}
              onChange={this.handlePhoneNumberChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='Password'
              label='Password'
              type='password'
              value={password}
              onChange={this.handlePasswordChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id='ConfirmPassword'
              label='Confirm Password'
              type='password'
              value={confirmPassword}
              onChange={this.handleConfirmPasswordChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              id='birthdate'
              label='Birthdate'
              fullWidth
              value={birthdate}
              onChange={this.handleBirthdateChange}
            />
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
