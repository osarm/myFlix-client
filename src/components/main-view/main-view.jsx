import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
            id: 1,
            title: "Scott Pilgrim vs. the World",
            description:
              "Based in Toronto, a man must defeat his new girlfriend's seven exes to win her heart.",
            image: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/g5IoYeudx9XBEfwNL0fHvSckLBz.jpg",
            genre: "Action",
            director: "Edgar Wright"  
        },
        {
            id: 2,
            title: "Always Be My Maybe",
            description:
              "After 15 years, Marcus and Sasha reunite with a sense of old sparks of attraction but are now in two different worlds.",
            image: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/3BO6pPa7qDcpPYct061Luh9fvst.jpg",
            genre: "Romance",
            director: "Nahnatchka Khan"  
        },
        {
            id: 3,
            title: "One Piece Film: Red",
            description:
              "Luffy and his crew head to a sonorous performance led by Uta - the most beloved singer in the New World.",
            image: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/ogDXuVkO92GcETZfSofXXemw7gb.jpg",
            genre: "Animation",
            director: "Goro Taniguchi"  
        }
    ]);

    const [selectedMovie, setSelectedMovie] = useState(null);

    if (selectedMovie) {
      return (
        <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
      );
    }
  
    if (movies.length === 0) {
      return <div>The list is empty!</div>;
    }
  
    return (
      <div>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)}
          />
        ))}
      </div>
    );
  };