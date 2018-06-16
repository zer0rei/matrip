import React from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Page404 = props => {
  const message = props.message || "Sorry, the page you're looking for cannot be found";
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
          variant='display4'
        >
          404
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          align='center'
          variant='display1'
          style={{fontSize: '1.5em'}}
        >
          {message} 
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          align='center'
          variant='display1'
          style={{fontSize: '1em'}}
        >
          <Link to='/' style={{textDecoration: "none"}}>
            <Button variant="contained" color="secondary">
              GO HOME
            </Button>
          </Link>
        </Typography>
      </Grid>
    </Grid>
  )
};

Page404.propTypes = {
  message: PropTypes.string,
};

export default Page404;
