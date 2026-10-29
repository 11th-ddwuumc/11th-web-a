import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex min-w-0 flex-col">
      <div className="relative w-full">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block overflow-hidden rounded-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)]"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block aspect-[2/3] w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
          />
        </Link>

        <BookmarkButton
          movieId={movie.id}
          variant="icon"
          className="absolute right-[10px] top-[10px]"
        />
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="mt-[9px] break-words text-sm font-extrabold text-[var(--color-text-primary)] no-underline hover:underline"
      >
        {movie.title}
      </Link>

      <p className="text-xs text-[var(--color-text-tertiary)]">
        {movie.releaseDate}
      </p>
    </article>
  );
}
