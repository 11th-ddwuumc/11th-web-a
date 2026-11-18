
import { useFavorite } from "../hooks/use-favorite";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const {
    isLoggedIn,
    isFavorite,
    isLoading,
    isError,
    isPending,
    toggleFavorite,
  } = useFavorite(movieId);

  const handleClick = () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용할 수 있어요.");
      return;
    }

    toggleFavorite();
  };

  return (
    <button
      type="button"
      aria-label={isFavorite ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isFavorite}
      disabled={isPending || (isLoggedIn && (isLoading || isError))}
      className={cn(
        "w-[36px] h-[36px] p-[6px] border border-white rounded-[8px] bg-black cursor-pointer",
        isFavorite && "bg-[#3b82f6] border-[#3b82f6]",
        (isPending || isLoading) && "opacity-50",
      )}
      onClick={handleClick}
    >
      <img
        className="w-full h-full brightness-0 invert"
        src={
          isFavorite
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}

