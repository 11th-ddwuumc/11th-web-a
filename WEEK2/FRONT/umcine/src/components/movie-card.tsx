
import type { TmdbMovieListItem } from "../api/movies/models";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";
import "./movie-card.css";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <div className="relative text-left">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        {posterUrl ? (
          <img
            className="block w-full aspect-[3/3.5] object-cover rounded-[10px]"
            src={posterUrl}
            alt={`${movie.title} 포스터`}
          />
        ) : (
          <div className="w-full aspect-[3/3.5] bg-gray-300 rounded-[10px] flex items-center justify-center text-gray-600">
            이미지 없음
          </div>
        )}
      </Link>

      <div className="absolute top-[10px] right-[10px] z-10">
        <BookmarkButton movieId={movie.id} />
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="!text-[20px] font-bold">{movie.title}</h2>
      </Link>

      <p>{movie.release_date}</p>
    </div>
  );
}

export default MovieCard;
