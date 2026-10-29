import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

const bookmarkIcon = "/icons/movie-icons/bookmark.svg";
const bookmarkOutlineIcon = "/icons/movie-icons/bookmark-outline.svg";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "label";
  className?: string;
}

export function BookmarkButton({
  movieId,
  variant = "label",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크에서 삭제" : "북마크에 추가"}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)]",
        variant === "icon"
          ? "h-[34px] w-[34px] rounded-lg border border-white bg-[var(--color-text-primary)]"
          : "gap-2 rounded-lg bg-[var(--color-action-primary)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--color-action-hover)]",
        className,
      )}
    >
      {variant === "icon" ? (
        <img
          src={isBookmarked ? bookmarkIcon : bookmarkOutlineIcon}
          alt=""
          className="h-6 w-6"
        />
      ) : (
        <>
          <img
            src={isBookmarked ? bookmarkIcon : bookmarkOutlineIcon}
            alt=""
            className="h-5 w-5"
          />
          {isBookmarked ? "북마크 해제" : "북마크 추가"}
        </>
      )}
    </button>
  );
}
