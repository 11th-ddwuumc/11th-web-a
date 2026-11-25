"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavoriteStatus,
  removeFavorite,
} from "../api/favoriteApi";
import { useAuthStore } from "../stores/auth-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const favoriteQuery = useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isLoggedIn && movieId > 0,
  });

  const isBookmarked = favoriteQuery.data?.isFavorite ?? false;

  const favoriteMutation = useMutation({
    mutationFn: async (nextFavorite: boolean) => {
      if (nextFavorite) {
        await addFavorite(movieId);
      } else {
        await removeFavorite(movieId);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  function handleToggle() {
    if (!isLoggedIn) {
      alert("로그인 후 북마크를 이용할 수 있습니다.");
      return;
    }

    if (favoriteQuery.isPending || favoriteMutation.isPending) {
      return;
    }

    favoriteMutation.mutate(!isBookmarked);
  }

  return (
    <div>
      <button
        type="button"
        aria-pressed={isBookmarked}
        disabled={
          isLoggedIn &&
          (favoriteQuery.isPending || favoriteMutation.isPending)
        }
        onClick={handleToggle}
      >
        {favoriteMutation.isPending
          ? "처리 중..."
          : isBookmarked
            ? "북마크 해제"
            : "북마크 추가"}
      </button>

      {favoriteQuery.isError && (
        <p role="alert">
          북마크 상태를 불러오지 못했습니다.
        </p>
      )}

      {favoriteMutation.isError && (
        <p role="alert">
          {favoriteMutation.error.message}
        </p>
      )}
    </div>
  );
}
