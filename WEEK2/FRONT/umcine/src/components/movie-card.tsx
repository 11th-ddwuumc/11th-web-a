import type { Movie } from "../types/movie";
import "./movie-card.css";
import { Link } from "@tanstack/react-router";
import { cn } from "../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="relative text-left">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <img
          className="block w-full aspect-[3/3.5] object-cover rounded-[10px]"
          src={movie.posterPath}
          alt={`${movie.title}포스터`}
        />
      </Link>
      <button
        className={cn(
          "absolute top-[10px] right-[10px] z-10 w-[36px] h-[36px] p-[6px] border border-white rounded-[8px] bg-black cursor-pointer",
          movie.isBookmarked && "bg-[#3b82f6] border-[#3b82f6]",
        )}
        onClick={() => onToggleBookmark(movie.id)}
      >
        <img
          className="w-full h-full brightness-0 invert"
          src={
            movie.isBookmarked
              ? "/icons/movie-icons/bookmark.svg"
              : "/icons/movie-icons/bookmark-outline.svg"
          }
          alt=""
        />
      </button>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="!text-[20px] font-bold">{movie.title}</h2>
      </Link>
      <p>{movie.releaseDate}</p>
    </div>
  );
}

export default MovieCard;
