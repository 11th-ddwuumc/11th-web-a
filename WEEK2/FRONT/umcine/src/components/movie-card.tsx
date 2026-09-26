import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <img
        className="movie-poster"
        src={movie.posterPath}
        alt={`${movie.title}포스터`}
      />

      <button
        className={`bookmark-button ${movie.isBookmarked ? "bookmarked" : ""}`}
        onClick={() => onToggleBookmark(movie.id)}
      >
        <img
          src={
            movie.isBookmarked
              ? "/icons/movie-icons/bookmark.svg"
              : "/icons/movie-icons/bookmark-outline.svg"
          }
          alt=""
        />
      </button>

      <h2>{movie.title}</h2>
      <p>{movie.releaseDate}</p>
    </div>
  );
}

export default MovieCard;
