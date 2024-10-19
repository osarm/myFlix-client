import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view"; 

import { Row, Col, Form } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    fetch("https://movies-fx-6586d0468f8f.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
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
        setError(error.message);
      });
  }, [token]);

  const onLoggedIn = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  const handleAddFavorite = (movieId) => {
    if (!user || !user.Username || !movieId) {
      console.error("User or movie data is missing.");
      return;
    }

    fetch(`https://movies-fx-6586d0468f8f.herokuapp.com/users/${user.Username}/movies/${movieId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add movie to favorites");
        }
        return response.json(); 
      })
      .then((updatedUser) => {
        alert("Movie added to favorites!");
        console.log("Updated user:", updatedUser);
      })
      .catch((error) => {
        console.error("Error adding favorite:", error);
        alert("Failed to add movie to favorites.");
      });
  };

  const filteredMovies = movies.filter((movie) => 
    movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={onLoggedOut} />
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <Col md={5}><LoginView onLoggedIn={onLoggedIn} /></Col>
            }
          />
          <Route
            path="/users/:userId"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <Col md={8}>
                  <ProfileView user={user} token={token} movies={movies} />
                </Col>
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? <Navigate to="/" /> : <Col md={5}><SignupView onLoggedIn={onLoggedIn} /></Col>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : movies.length === 0 ? (
                <Col>The list is empty</Col>
              ) : (
                <Col md={8}>
                  <MovieView movies={movies} user={user} token={token} />
                </Col>
              )
            }
          />
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : movies.length === 0 ? (
                <Col>The list is empty</Col>
              ) : (
                <>
                  <Col md={12} className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Search for a movie"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Col>
                  {filteredMovies.map((movie) => (
                    <Col className="mb-4" key={movie._id} md={3}>
                      <MovieCard movie={movie} onAddFavorite={handleAddFavorite} />
                    </Col>
                  ))}
                </>
              )
            }
          />
          <Route
            path="/profile"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <Col md={8}>
                  <ProfileView user={user} token={token} movies={movies} />
                </Col>
              )
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
