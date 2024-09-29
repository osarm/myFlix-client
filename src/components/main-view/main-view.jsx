import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import {SignupView} from "../signup-view/signup-view";

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("https://movies-fx-6586d0468f8f.herokuapp.com/movies")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log fetched data
        
        const moviesFromApi = data.map((movie) => {
          return {
            _id: movie._id,
            Title: movie.Title,
            Description: movie.Description,
            Genre: movie.Genre,
            Director: movie.Director,
            ImagePath: movie.ImagePath,
            Featured: movie.Featured,
          };
        });
  
        setMovies(moviesFromApi);
      })
      .catch((error) => console.error('Error fetching movies:', error));
  }, [token]);

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
        <MovieView movie={selectedMovie}
         onBackClick={() => setSelectedMovie(null)} />
      );
    }
  
    if (movies.length === 0) {
      return (
        <>
          <button
            onClick={() => {
              setUser(null);
            }}
          >
            Logout
          </button>
          <div>The list is empty!</div>
        </>
      );
    }
  
    return (
      <div>
        {console.log(movies)} {/* Log movies array to ensure it's populated */}
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)}
          />
        ))}
      </div>
    );
  };

<button onClick={() => { setUser(null); setToken(null); 
  localStorage.clear(); }}>Logout</button>