import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

  console.log("Stored user:", storedUser);
  console.log("Stored token:", storedToken);
  console.log("Current user:", user);

  useEffect(() => {
    if (!token) {
      console.log("No token found, not fetching movies.");
      return;
    }

    console.log("Fetching movies with token:", token);
    fetch("https://movies-fx-6586d0468f8f.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Movies fetched:", data);
        const moviesFromApi = data.map((movie) => ({
          _id: movie._id,
          Title: movie.Title,
          Description: movie.Description,
          Genre: movie.Genre,
          Director: movie.Director,
          ImagePath: movie.ImagePath,
          Featured: movie.Featured,
        }));
        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setError(error.message);
      });
  }, [token]);

  if (error) {
    return <div>Errorrrr: {error}</div>;
  }

  // If user is not logged in, show LoginView and SignupView
  if (!user) {
    return (
      <>
        <LoginView onLoggedIn={(user, token) => {
          setUser(user);
          setToken(token);
        }} />
        or
        <SignupView />
      </>
    );
  }

  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)}
        />
      ))}
      
      <button
        onClick={() => { 
          setUser(null); 
          setToken(null); 
          localStorage.clear(); 
        }}
      >
        Logout
      </button>
    </div>
  );
};