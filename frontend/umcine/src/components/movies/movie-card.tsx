import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
  isBookmarked: boolean;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  let bookmarkIcon = "/icons/movie-icons/bookmark-outline.svg";
  let bookmarkLabel = "북마크 추가";

  if (isBookmarked) {
    bookmarkIcon = "/icons/movie-icons/bookmark.svg";
    bookmarkLabel = "북마크 해제";
  }

  const releaseDateText = movie.release_date
    ? movie.release_date.replace(/-/g, ".")
    : "개봉일 정보 없음";

  return (
    <article className="flex h-full min-h-0 w-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="h-full w-full rounded-[10px] object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gray-200 text-xs text-gray-500">
              이미지 없음
            </div>
          )}
        </Link>

        <button
          type="button"
          className={cn(
            "absolute top-2 right-2 z-2",
            "flex h-7 w-7 items-center justify-center",
            "rounded-lg border-none bg-black/70 p-0",
            "cursor-pointer",
            isBookmarked && "bg-[#5b5ce9]",
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

      <p className="mt-1 shrink-0 text-xs text-[#9ca3af]">{releaseDateText}</p>
    </article>
  );
}
