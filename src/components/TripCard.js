import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { format, formatDistanceStrict } from "date-fns";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    paddingTop: 16,
    [theme.breakpoints.up("md")]: {
      padding: 32
    }
  },
  infoContainer: {
    [theme.breakpoints.up("md")]: {
      paddingLeft: 48,
      paddingRight: 48
    }
  },
  arrowIcon: {
    fontSize: 64,
    color: theme.palette.primary.light
  },
  place: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
    }
  },
  price: {
    fontWeight: "bold",
    color: theme.palette.primary.dark
  },
  currency: {
    fontWeight: "normal",
    fontSize: "0.7em"
  },
  carrierContainer: {
    margin: 0,
    paddingBottom: 8
  },
  lineContainer: {
    margin: 0,
    padding: 0
  },
  line: {
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 256,
    fontWeight: "bold",
    width: 36
  },
  favoriteContainer: {
    width: "100%",
    height: 8
  },
  favorite: {
    position: "absolute",
    [theme.breakpoints.up("md")]: {
      right: 32
    }
  }
});

const TripCard = props => {
  const { classes, trip, type, key, favorite, onFavoriteChange } = props;
  const renderTrip = (src, dst, dptDate, arrvDate, direct, price, link, carrier, line) => {
    return (
      <Grid
        container
        spacing={8}
        alignItems="center"
        direction="row"
        justify="center"
      >
        <Grid item xs>
          <Grid
            container
            alignItems="center"
            direction="row"
            justify="center"
            className={classes.infoContainer}
          >
            <Grid item xs={4}>
              <CardContent>
                <Typography
                  className={classes.place}
                  align="center"
                  variant="headline"
                >
                  {src}
                </Typography>
                <Typography
                  align="center"
                  variant="subheading"
                  color="textSecondary"
                >
                  {format(dptDate, "HH:mm")}
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={4}>
              <Grid
                container
                alignItems="center"
                direction="column"
                justify="center"
              >
                <CardContent>
                  {(direct !== undefined) &&
                  <Typography
                    align="center"
                    variant="subheading"
                    color="secondary"
                  >
                    {direct ?
                      <span style={{color: "green"}}>
                        direct
                      </span> :
                    "not direct"}
                  </Typography>
                  }
                  <Icon className={classes.arrowIcon}>
                    arrow_right_alt
                  </Icon>
                  <Typography
                    align="center"
                    variant="subheading"
                    color="textSecondary"
                  >
                    {arrvDate ?
                      formatDistanceStrict(dptDate, arrvDate) :
                    "TBD"}
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <CardContent>
                <Typography
                  className={classes.place}
                  align="center"
                  variant="headline"
                >
                  {dst}
                </Typography>
                <Typography
                  align="center"  
                  variant="subheading"
                  color="textSecondary"
                >
                  {arrvDate ?
                    format(arrvDate, "HH:mm") :
                  "TBD"}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid
            container
            alignItems="center"
            direction="column"
            justify="center"
          >
            <CardContent>
              <Typography
                variant="title"
                align="center"
                className={classes.price}
              >
                {price} <span className={classes.currency}>MAD</span>
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="secondary"
                href={link}
                disabled={link === undefined}
              >
                Select
              </Button>
            </CardActions>
            <CardContent className={classes.carrierContainer}>
              <Typography
                align="center"  
                variant="subheading"
                color="textSecondary"
              >
                {carrier}
              </Typography>
            </CardContent>
            {line !== undefined &&
            <CardContent className={classes.lineContainer}>
              <Typography
                align="center"  
                variant="headline"
                color="primary"
                className={classes.line}
              >
                {line}
              </Typography>
            </CardContent>
            }
          </Grid>
        </Grid>
      </Grid>
    )
  }
  return (
    <Card className={classes.root}>
      {favorite !== undefined &&
      <CardActions className={classes.favoriteContainer}>
        <IconButton
          className={classes.favorite}
          color="secondary"
          aria-label="Add to favorite"
          onClick={onFavoriteChange}
        >
          <Icon>
            { favorite ? "favorite" : "favorite_border" }
          </Icon>
        </IconButton>
      </CardActions>
      }
      {renderTrip(
        trip.source,
        trip.destination,
        trip.departDate,
        trip.arrivalDate,
        trip.direct,
        trip.price,
        trip.link,
        trip.carrier,
        trip.line
      )}
      {trip.returnDate && renderTrip(
        trip.destination,
        trip.source,
        trip.returnDate,
        trip.returnArrivalDate,
        trip.returnDirect,
        trip.returnPrice,
        trip.returnLink,
        trip.returnCarrier,
        trip.returnLine
      )}
    </Card>
  );
}

TripCard.propTypes = {
  classes: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  favorite: PropTypes.bool,
  onFavoriteChange: PropTypes.func,
};

export default withStyles(styles)(TripCard);
