import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    return <div>Error: {error}</div>;
  }

  // If user is not logged in, show LoginView and SignupView
  if (!user) {
    return (
      <Row className="justify-content-md-center">
        <Col md={12} className="text-center my-3">
        <h1>MyFlix DB</h1></Col>
        <Col md={5}>
          <LoginView
            onLoggedIn={(user, token) => {
              setUser(user);
              setToken(token);
            }}
          />
        </Col>
        <Col md={12} className="text-center my-3">
          <span>or</span>
        </Col>
        <Col md={5}>
          <SignupView />
        </Col>
      </Row>
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
    <Row className="justify-content-md-center mt-5">
      {!user ? (
         <Col md={5}>           
          <LoginView onLoggedIn={(user) => setUser(user)} />
          or
          <SignupView />
          </Col>
      ) : selectedMovie ? (
        <Col md={8}>
        <MovieView 
          movie={selectedMovie} 
          onBackClick={() => setSelectedMovie(null)} 
        />
        </Col>
      ) : movies.length === 0 ? (
        <div>The list is empty!</div>
      ) : (
        <>
         <Row className="justify-content-md-center mt-5">
      <Col xs={12} className="text-center">
        <h1>Movie List</h1>
      </Col>
    </Row>
    {movies.map((movie) => (
  <Col className="mb-5" key={movie._id} md={3}>
    <MovieCard
      movie={movie}
      onMovieClick={(newSelectedMovie) => {
        setSelectedMovie(newSelectedMovie);
      }}
    />
  </Col>
))}
        </>
      )}
      <Col xs={12} className="text-left mt-3 mb-3">
       <Button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</Button></Col>
    </Row>
  );
};
