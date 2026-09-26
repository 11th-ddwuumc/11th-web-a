import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import { movies as initialMovies } from "./data/movie";
import type { Movie } from "./types/movie";
import "./App.css";
import Pagination from "./components/pagination";

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie,
      ),
    );
  }

  return (
    <>
      <Header />

      <main>
        <h2>영화 목록</h2>

        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      </main>
      <Pagination />
    </>
  );
}

export default App;
