
import MovieCard from "./movie-card";
import type { TmdbMovieListItem } from "../api/movies/models";
import "./movie-grid.css";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieGrid;
