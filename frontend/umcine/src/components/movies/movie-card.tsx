import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  let bookmarkIcon = "/icons/movie-icons/bookmark-outline.svg";
  let bookmarkLabel = "북마크 추가";

  if (movie.isBookmarked) {
    bookmarkIcon = "/icons/movie-icons/bookmark.svg";
    bookmarkLabel = "북마크 해제";
  }

  return (
    <article className="flex h-full min-h-0 w-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
        >
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="h-full w-full rounded-[10px] object-cover"
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute top-2 right-2 z-2",
            "flex h-7 w-7 items-center justify-center",
            "rounded-lg border-none bg-black/70 p-0",
            "cursor-pointer",
            movie.isBookmarked && "bg-[#5b5ce9]",
          )}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={bookmarkLabel}
        >
          <img
            src={bookmarkIcon}
            alt=""
            className="h-4 w-4 brightness-0 invert"
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="block shrink-0"
      >
        <h3 className="mt-2 truncate text-[13px] font-bold leading-[18px] text-[#111827]">
          {movie.title}
        </h3>
      </Link>

      <p className="mt-1 shrink-0 text-xs text-[#9ca3af]">
        {movie.releaseDate}
      </p>
    </article>
  );
}