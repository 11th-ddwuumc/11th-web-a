import "./movie-grid.css";
import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <section className="movie-grid">
      {movies.map((Movie) => (
        <MovieCard
          key={Movie.id}
          movie={Movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}

export default MovieGrid;