import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
      password: ''
    };
  }

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  }

  render() {
    const { email, password } = this.state;
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
            value={email}
            onChange={this.handleEmailChange}
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
