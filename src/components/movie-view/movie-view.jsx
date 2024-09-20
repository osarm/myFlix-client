import React from "react";
import PropTypes from "prop-types";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <h1>{movie.Title}</h1> {/* Show title */}
      <p><strong>Director:</strong> {movie.Director.Name}</p> {/* Show director */}
      <p><strong>Description:</strong> {movie.Description}</p> {/* Show description */}
      <p><strong>Genre:</strong> {movie.Genre.Name}</p> {/* Show genre */}
      <button onClick={onBackClick}>Back</button> {/* Back button */}
    </div>
  );
};

  MovieView.propTypes = {
    movie: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
      Genre: PropTypes.shape({
        Name: PropTypes.string.isRequired
      })
      .isRequired,
      Director: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Bio: PropTypes.string,
        Birth: PropTypes.string,
        Death: PropTypes.string
      })
      .isRequired,
      ImagePath: PropTypes.string.isRequired,
      Featured: PropTypes.bool.isRequired
    })
    .isRequired,
    onBackClick: PropTypes.func.isRequired
  };