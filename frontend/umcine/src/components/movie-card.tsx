import "./movie-card.css";

import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="poster"
        />

        <button
          type="button"
          className={`bookmark-button ${
            movie.isBookmarked ? "bookmarked" : ""
          }`}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={
            movie.isBookmarked
              ? "북마크 해제"
              : "북마크 추가"
          }
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
      </div>

      <h3>{movie.title}</h3>

      <p>{movie.releaseDate}</p>
    </article>
  );
}