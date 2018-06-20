import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Signup from "./Signup";
import Login from "./Login";
import PasswordForm from "./PasswordForm";

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    marginTop: 16,
  },
  container: {
    padding: 32,
    borderRadius: 16
  }
});

const Profile = props => {
  const { classes, selectedTab, user, onUserUpdate, isLoggedIn } = props;

  return (
    <Grid
      container
      className={classes.root}
      alignItems="center"
      direction="row"
      justify="center"
    >
      <Grid item xs={11} md={8}>
        <Paper className={classes.container}>
          {selectedTab === 0 &&
          <Signup
            variant="modify"
            user={user}
            onUserUpdate={onUserUpdate}
            isLoggedIn={isLoggedIn}
          />
          }
          {selectedTab === 1 &&
          <PasswordForm
            user={user}
            onUserUpdate={onUserUpdate}
            isLoggedIn={isLoggedIn}
          />
          }
          {selectedTab === 2 &&
          <Login
            variant="delete"
            user={user}
            onUserUpdate={onUserUpdate}
            isLoggedIn={isLoggedIn}
          />
          }
        </Paper>
      </Grid>
    </Grid>
  );
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedTab: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  onUserUpdate: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};

export default withStyles(styles)(Profile);
