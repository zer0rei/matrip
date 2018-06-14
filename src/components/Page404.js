import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const Page404 = props => {
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
          Sorry, the page you're looking for cannot be found
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          align='center'
          variant='display1'
          style={{fontSize: '1em'}}
        >
          <Link to='/'>GO HOME</Link>
        </Typography>
      </Grid>
    </Grid>
  )
};

export default Page404;
