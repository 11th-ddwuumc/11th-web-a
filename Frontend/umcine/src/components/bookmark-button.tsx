import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  createFavorite,
  deleteFavorite,
  getFavoriteStatus,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });
  const isBookmarked = favoriteStatusQuery.data?.isFavorite ?? false;
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        await deleteFavorite(movieId);
      } else {
        await createFavorite(movieId);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ["favorites", "status", movieId],
        { isFavorite: !isBookmarked },
      );
      queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
  });

  function handleClick() {
    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }

    if (!favoriteMutation.isPending) favoriteMutation.mutate();
  }

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크에서 삭제" : "북마크에 추가"}
      aria-pressed={isBookmarked}
      onClick={handleClick}
      disabled={favoriteMutation.isPending}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)]",
        variant === "icon"
          ? "h-[34px] w-[34px] rounded-lg border border-white bg-[var(--color-text-primary)]"
          : "gap-2 rounded-lg bg-[var(--color-action-primary)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--color-action-hover)]",
        favoriteMutation.isPending && "cursor-wait opacity-60",
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
