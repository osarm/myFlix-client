import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

  // Fetch movies if the token exists
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
    return <div>Error: {error}</div>;
  }

  // Logout functionality
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Main route for the movie list */}
        <Route
          path="/"
          element={
            user ? (
              <>
                {selectedMovie ? (
                  <MovieView
                    movie={selectedMovie}
                    onBackClick={() => setSelectedMovie(null)}
                  />
                ) : (
                  <div>
                    {movies.length === 0 ? (
                      <div>The list is empty!</div>
                    ) : (
                      movies.map((movie) => (
                        <MovieCard
                          key={movie._id}
                          movie={movie}
                          onMovieClick={(newSelectedMovie) =>
                            setSelectedMovie(newSelectedMovie)
                          }
                        />
                      ))
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login route */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <LoginView
                onLoggedIn={(user, token) => {
                  setUser(user);
                  setToken(token);
                  localStorage.setItem("user", JSON.stringify(user));
                  localStorage.setItem("token", token);
                }}
              />
            )
          }
        />

        {/* Signup route */}
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <SignupView
                onSignedUp={(user, token) => {
                  setUser(user);
                  setToken(token);
                  localStorage.setItem("user", JSON.stringify(user));
                  localStorage.setItem("token", token);
                }}
              />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};