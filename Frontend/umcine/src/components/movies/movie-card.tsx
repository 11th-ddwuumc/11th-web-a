import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { useBookmarkStore } from "../../stores/bookmark-store";

const bookmarkIcon = "/icons/movie-icons/bookmark.svg";
const bookmarkOutlineIcon =
  "/icons/movie-icons/bookmark-outline.svg";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({
  movie,
}: MovieCardProps) {
  const posterSrc = movie.posterPath;

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );


   return (
      <article className="flex min-w-0 flex-col gap-0">
            <div className="relative w-full">
                <Link
                    to="/movies/$movieId"
                    params={{
                    movieId: String(movie.id),
                    }}
                    className="block"
                >
                    <img
                    src={posterSrc}
                    alt={`${movie.title} 포스터`}
                    className="
                        mb-[9px] block
                        aspect-[2/3] w-full
                        rounded-[5px] object-cover
                    "
                    />
                </Link>

                <button
                    type="button"
                    aria-label={
                        isBookmarked
                            ? "북마크에서 삭제"
                            :"북마크에서 추가"
                    }
                    onClick={() => toggleBookmark(movie.id)}
                    className="
                    absolute right-[10px] top-[10px]
                    flex h-[34px] w-[34px]
                    items-center justify-center
                    rounded-lg border border-white
                    bg-[var(--color-text-primary)]
                    "
                >
                    <img
                    src={
                        isBookmarked
                        ? bookmarkIcon
                        : bookmarkOutlineIcon
                    }
                    alt=""
                    className="h-6 w-6"
                    />
                </button>
                </div>
            
            
            <div className="break-words 
                            font - ['Pretendard']
                            text-sm font-extrabold
                            text-[var(--color-text-primary)]">
            
                {movie.title}
            </div>

            <div
                className="
                    font-['Pretendard']
                    text-xs font-normal
                    text-[var(--color-text-tertiary)]
                "
            >
                {movie.releaseDate}
            </div>
    </article>
  );
}
