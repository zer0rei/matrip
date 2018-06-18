import React, { Component } from "react";
import PropTypes from "prop-types";
import TripList from "./TripList";


const Favorites = (props) => {
  const { selectedTab } = props;

// TODO: get favorites from backend
  const favorites = null;

  let renderedFavorites = null;
  if (selectedTab === 0) {
    renderedFavorites = favorites ?
      <TripList trips={favorites.flights}/> : null;
  } else if (selectedTab === 1) {
    renderedFavorites = favorites ?
      <TripList trips={favorites.trains}/> : null;
  } else if (selectedTab === 2) {
    renderedFavorites = favorites ?
      <TripList trips={favorites.buses}/> : null;
  } else if (selectedTab === 3) {
    renderedFavorites = favorites ?
      <TripList trips={favorites.carpools}/> : null;
  }
  return (
    <div>
      {renderedFavorites}
    </div>
  );
}

Favorites.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedTab: PropTypes.number,
};

export default Favorites;
