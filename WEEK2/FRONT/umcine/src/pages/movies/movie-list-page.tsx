import { useState } from "react";
import MovieGrid from "../../components/movie-grid";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import "./movie-list-page.css";
import Pagination from "../../components/pagination";

export function MovieListPage() {
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
      <main>
        <h2>영화 목록</h2>

        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      </main>
      <Pagination />
    </>
  );
}
