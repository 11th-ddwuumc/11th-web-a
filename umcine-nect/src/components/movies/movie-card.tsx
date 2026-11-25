"use client";

import Link from "next/link";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { useAuthStore } from "../../stores/auth-store";
import {
  addFavorite,
  getFavoriteStatus,
  removeFavorite,
} from "../../api/favoriteApi";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const favoriteQuery = useQuery({
    queryKey: ["favorites", "status", movie.id],
    queryFn: () => getFavoriteStatus(movie.id),
    enabled: isLoggedIn,
  });

  const isBookmarked = favoriteQuery.data?.isFavorite ?? false;

  const favoriteMutation = useMutation({
    mutationFn: async (nextFavorite: boolean) => {
      if (nextFavorite) {
        await addFavorite(movie.id);
      } else {
        await removeFavorite(movie.id);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  function handleToggleBookmark() {
    if (!isLoggedIn) {
      alert("로그인 후 북마크를 이용할 수 있습니다.");
      return;
    }

    if (
      favoriteQuery.isPending ||
      favoriteMutation.isPending
    ) {
      return;
    }

    favoriteMutation.mutate(!isBookmarked);
  }

  return (
    <article className="min-w-0">
      <div className="relative aspect-[240/272] w-full overflow-hidden rounded-[10px] bg-gray-200">
        <Link
          className="block h-full w-full"
          href={`/movies/${movie.id}`}
        >
          <img
            className="h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute top-2.5 right-2.5 grid size-[34px] place-items-center rounded-[7px] border border-white bg-[#191b1f]/80 p-[5px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            isBookmarked && "border-blue-600 bg-blue-600",
          )}
          aria-label={`${movie.title} ${
            isBookmarked ? "북마크 해제" : "북마크 추가"
          }`}
          aria-pressed={isBookmarked}
          title={
            favoriteQuery.isError
              ? "북마크 상태를 불러오지 못했습니다."
              : isBookmarked
                ? "북마크 해제"
                : "북마크 추가"
          }
          disabled={
            (isLoggedIn && favoriteQuery.isPending) ||
            favoriteMutation.isPending ||
            favoriteQuery.isError
          }
          onClick={handleToggleBookmark}
        >
          <img
            className="size-6 brightness-0 invert"
            src={
              isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 className="mt-2 mb-[3px] text-sm leading-snug font-bold tracking-tight">
        <Link
          href={`/movies/${movie.id}`}
        >
          {movie.title}
        </Link>
      </h2>

      <p className="text-xs text-gray-500">
        {movie.releaseDate}
      </p>

      {favoriteMutation.isError && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {favoriteMutation.error.message}
        </p>
      )}
    </article>
  );
}
