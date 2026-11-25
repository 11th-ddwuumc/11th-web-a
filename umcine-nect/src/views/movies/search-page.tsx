"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { searchMovies } from "../../api/movies";
import {
  addFavorite,
  getFavoriteStatus,
  removeFavorite,
} from "../../api/favoriteApi";
import { useAuthStore } from "../../stores/auth-store";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const query = useSearchParams().get("query") ?? undefined;

  return (
    <SearchContent
      key={query ?? ""}
      query={query?.trim()}
    />
  );
}

function SearchContent({ query }: { query?: string }) {
  const navigate = useRouter();

  const [searchText, setSearchText] = useState(query ?? "");
  const [page, setPage] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery({
    queryKey: [
      "movies",
      "search",
      { query: normalizedQuery, page },
    ],
    queryFn: () => searchMovies(normalizedQuery, page),
    enabled: normalizedQuery.length > 0,
  });

  const results = searchQuery.data?.results ?? [];
  const totalResults = searchQuery.data?.total_results ?? 0;
  const totalPages = Math.min(
    searchQuery.data?.total_pages ?? 0,
    500,
  );

  const isLoading =
    normalizedQuery.length > 0 && searchQuery.isPending;

  const error = searchQuery.isError
    ? "검색 결과를 불러오지 못했습니다."
    : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();
    setSearchText(nextQuery);

    if (nextQuery === normalizedQuery) {
      if (page !== 1) {
        setPage(1);
      } else if (nextQuery) {
        void searchQuery.refetch();
      }
      return;
    }

    navigate.push(nextQuery ? `/search?query=${encodeURIComponent(nextQuery)}` : "/search");
  }

  function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1360px] flex-1 px-5 pb-16 sm:px-10",
        normalizedQuery ? "pt-6" : "pt-24 sm:pt-44",
      )}
    >
      <h1
        className={cn(
          "mb-5 text-[28px] font-bold tracking-tight sm:text-[34px]",
          !normalizedQuery && "mb-8 text-center",
        )}
      >
        {normalizedQuery
          ? "영화 검색"
          : "어떤 영화를 찾고 있나요?"}
      </h1>

      <form
        className={cn(
          "flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 pl-4",
          !normalizedQuery &&
            "mx-auto max-w-[800px] border-[#191b1f] p-3 pl-5 shadow-lg",
        )}
        role="search"
        onSubmit={handleSubmit}
      >
        <img
          className="size-5 shrink-0"
          src="/icons/search.svg"
          alt=""
        />

        <input
          ref={inputRef}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-gray-400 focus-visible:outline-2 focus-visible:outline-blue-600"
          type="text"
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) =>
            setSearchText(event.target.value)
          }
        />

        {searchText && (
          <button
            className="grid size-8 shrink-0 place-items-center"
            type="button"
            aria-label="검색어 지우기"
            onClick={() => {
              setSearchText("");
              inputRef.current?.focus();
            }}
          >
            <img
              className="size-5"
              src="/icons/close.svg"
              alt=""
            />
          </button>
        )}

        <button
          className="shrink-0 rounded-md bg-[#191b1f] px-4 py-3 text-xs font-bold text-white hover:bg-gray-800"
          type="submit"
        >
          {normalizedQuery ? "다시 검색" : "검색"}
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="mt-5 text-center text-sm text-gray-500">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4">
            <h2 className="wrap-anywhere text-base font-bold">
              ‘{query}’ 검색 결과
            </h2>

            <p
              className="text-xs text-gray-400"
              role="status"
            >
              {isLoading
                ? "검색 중..."
                : error
                  ? "검색 실패"
                  : `영화 ${totalResults}편`}
            </p>
          </div>

          {isLoading ? (
            <p
              role="status"
              className="py-16 text-center text-gray-500"
            >
              영화를 검색하는 중입니다...
            </p>
          ) : error ? (
            <div
              role="alert"
              className="py-16 text-center"
            >
              <p className="mb-4 text-red-500">
                {error}
              </p>

              <button
                type="button"
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
                onClick={() => void searchQuery.refetch()}
              >
                다시 시도
              </button>
            </div>
          ) : results.length === 0 ? (
            <p className="py-16 text-center text-gray-500">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid gap-x-10 md:grid-cols-2">
              {results.map((movie) => (
                <SearchResultItem
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </ul>
          )}

          {!isLoading &&
            !error &&
            results.length > 0 &&
            totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-center gap-4"
                aria-label="검색 결과 페이지"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    handlePageChange(page - 1)
                  }
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  이전
                </button>

                <span
                  className="text-sm text-gray-600"
                  aria-live="polite"
                >
                  {page} / {totalPages} 페이지
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    handlePageChange(page + 1)
                  }
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  다음
                </button>
              </nav>
            )}
        </>
      )}
    </main>
  );
}

function SearchResultItem({ movie }: { movie: Movie }) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const isLoggedIn = Boolean(accessToken);

  const favoriteQuery = useQuery({
    queryKey: ["favorites", "status", movie.id],
    queryFn: () => getFavoriteStatus(movie.id),
    enabled: isLoggedIn,
  });

  const isBookmarked =
    favoriteQuery.data?.isFavorite ?? false;

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
    <li className="flex gap-4 border-b border-gray-200 py-5">
      <Link
        className="shrink-0 self-start"
        href={`/movies/${movie.id}`}
      >
        <img
          className="aspect-[2/3] w-24 rounded-lg object-cover sm:w-[124px]"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold">
          <Link
            href={`/movies/${movie.id}`}
          >
            {movie.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs leading-5 text-gray-400">
          {movie.originalTitle}
          <span className="ml-2">
            {movie.releaseDate}
          </span>
        </p>

        <p className="mt-2 text-xs leading-6 text-gray-500">
          {movie.overview}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            aria-pressed={isBookmarked}
            aria-label={`${movie.title} ${
              isBookmarked ? "북마크 해제" : "북마크 추가"
            }`}
            onClick={handleToggleBookmark}
            disabled={
              (isLoggedIn && favoriteQuery.isPending) ||
              favoriteMutation.isPending ||
              favoriteQuery.isError
            }
            className={cn(
              "inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50",
              isBookmarked &&
                "border-blue-600 bg-blue-600 text-white",
            )}
          >
            <img
              className={cn(
                "size-4",
                isBookmarked && "brightness-0 invert",
              )}
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
            />

            {favoriteMutation.isPending
              ? "처리 중..."
              : isBookmarked
                ? "북마크 해제"
                : "북마크"}
          </button>

          <Link
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
            href={`/movies/${movie.id}`}
          >
            상세 보기
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {favoriteQuery.isError && (
          <p
            className="mt-2 text-xs text-red-600"
            role="alert"
          >
            북마크 상태를 불러오지 못했습니다.
          </p>
        )}

        {favoriteMutation.isError && (
          <p
            className="mt-2 text-xs text-red-600"
            role="alert"
          >
            {favoriteMutation.error.message}
          </p>
        )}
      </div>
    </li>
  );
}