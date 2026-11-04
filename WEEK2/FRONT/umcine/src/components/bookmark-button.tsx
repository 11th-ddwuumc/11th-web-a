import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      className={cn(
        "w-[36px] h-[36px] p-[6px] border border-white rounded-[8px] bg-black cursor-pointer",
        isBookmarked && "bg-[#3b82f6] border-[#3b82f6]",
      )}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="w-full h-full brightness-0 invert"
        src={
          isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}
