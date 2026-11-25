"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getMovieDetail } from "../../api/movies";
import {
  getFavoriteStatus,
  addFavorite,
  removeFavorite,
} from "../../api/favoriteApi";
import {
  getMyRatings,
  createRating,
  updateRating,
  deleteRating,
} from "../../api/ratingApi";
import { useAuthStore } from "../../stores/auth-store";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams<{ movieId: string }>();

  const movieId = Number(movieIdParam);
  const isValidMovieId =
    Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  if (!isValidMovieId) {
    return (
      <main className="mx-auto w-full max-w-[1360px] px-5 py-16 sm:px-10">
        <h1 className="mb-6 text-2xl font-bold">
          올바르지 않은 영화 번호예요.
        </h1>

        <Link
          className="text-blue-600 underline underline-offset-4"
          href="/"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main
        role="status"
        className="mx-auto w-full max-w-[1360px] px-5 py-16 sm:px-10"
      >
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main
        role="alert"
        className="mx-auto w-full max-w-[1360px] px-5 py-16 sm:px-10"
      >
        <h1 className="mb-4 text-2xl font-bold">
          영화 상세 정보를 불러오지 못했습니다.
        </h1>

        <button
          type="button"
          onClick={() => void movieDetailQuery.refetch()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          다시 시도
        </button>

        <Link
          className="ml-4 text-blue-600 underline underline-offset-4"
          href="/"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <MovieDetail
      key={movieDetailQuery.data.id}
      movie={movieDetailQuery.data}
    />
  );
}

function MovieDetail({ movie }: { movie: Movie }) {
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const isLoggedIn = Boolean(accessToken);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);

  const favoriteQuery = useQuery({
    queryKey: ["favorites", "status", movie.id],
    queryFn: () => getFavoriteStatus(movie.id),
    enabled: isLoggedIn,
  });

  const ratingsQuery = useQuery({
    queryKey: ["ratings", "me"],
    queryFn: getMyRatings,
    enabled: isLoggedIn,
  });

  const myRating = ratingsQuery.data?.find(
    (item) => item.movieId === movie.id,
  );

  const isBookmarked =
    favoriteQuery.data?.isFavorite ?? false;

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        await removeFavorite(movie.id);
      } else {
        await addFavorite(movie.id);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const createRatingMutation = useMutation({
    mutationFn: createRating,
    onSuccess: async () => {
      setSaved(true);

      await queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: ({
      ratingId,
      score,
      comment,
    }: {
      ratingId: number;
      score: number;
      comment: string;
    }) => updateRating(ratingId, { score, comment }),
    onSuccess: async () => {
      setSaved(true);

      await queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    },
  });

  const deleteRatingMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: async () => {
      setRating(0);
      setReview("");
      setSaved(false);

      await queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    },
  });

  function handleToggleFavorite() {
    if (!isLoggedIn) {
      alert("즐겨찾기는 로그인 후 이용할 수 있습니다.");
      return;
    }

    favoriteMutation.mutate();
  }

  function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("1~5점 사이의 평점을 선택해주세요.");
      return;
    }

    setSaved(false);

    if (myRating) {
      updateRatingMutation.mutate({
        ratingId: myRating.ratingId,
        score: rating,
        comment: review,
      });
    } else {
      createRatingMutation.mutate({
        movieId: movie.id,
        score: rating,
        comment: review,
      });
    }
  }

  function handleLoadRating() {
    if (!myRating) return;

    setRating(myRating.score);
    setReview(myRating.comment ?? "");
    setSaved(false);
  }

  function handleDeleteRating() {
    if (!myRating) return;

    if (window.confirm("작성한 평점을 삭제할까요?")) {
      deleteRatingMutation.mutate(myRating.ratingId);
    }
  }

  const ratingError =
    createRatingMutation.error ??
    updateRatingMutation.error ??
    deleteRatingMutation.error;

  const isSavingRating =
    createRatingMutation.isPending ||
    updateRatingMutation.isPending;

  return (
    <main className="flex-1 pb-16">
      <section
        className="relative h-[340px] bg-gray-900 text-white lg:h-[360px]"
        aria-label="영화 정보"
      >
        {movie.backdropPath && (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={movie.backdropPath}
            alt=""
          />
        )}

        <div
          className="absolute inset-0 bg-linear-to-r from-black/65 via-black/20 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full max-w-[1360px] flex-col justify-between px-5 py-6 sm:px-10">
          <Link
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold"
            href="/"
          >
            <img
              className="size-5 brightness-0 invert"
              src="/icons/chevron-left.svg"
              alt=""
            />
            영화 목록
          </Link>

          <div>
            <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-[40px]">
              {movie.title}
            </h1>

            <p className="mt-2 text-sm">
              {movie.originalTitle}
            </p>

            <p className="mt-2 text-xs leading-6">
              {movie.releaseDate} ·{" "}
              {movie.genres.join(" · ")} ·{" "}
              {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1360px] gap-8 px-5 pt-6 sm:grid-cols-[200px_minmax(0,1fr)] sm:px-10 lg:grid-cols-[200px_minmax(0,1fr)_360px]">
        <img
          className="aspect-[2/3] w-40 rounded-lg object-cover shadow-xl sm:w-[200px]"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <section aria-label="영화 소개">
          <h2 className="text-xl font-bold">
            {movie.tagline || movie.title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {movie.overview ||
              "영화 소개 정보가 없습니다."}
          </p>

          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={handleToggleFavorite}
            disabled={
              !isLoggedIn ||
              favoriteQuery.isPending ||
              favoriteMutation.isPending
            }
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50",
              isBookmarked && "bg-blue-700",
            )}
          >
            <img
              className="size-4 brightness-0 invert"
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
                ? "즐겨찾기 해제"
                : "즐겨찾기"}
          </button>

          {!isLoggedIn && (
            <p className="mt-2 text-xs text-gray-500">
              즐겨찾기는 로그인 후 이용할 수 있습니다.
            </p>
          )}

          {favoriteQuery.isError && (
            <p className="mt-2 text-xs text-red-600">
              즐겨찾기 상태를 불러오지 못했습니다.
            </p>
          )}

          {favoriteMutation.isError && (
            <p className="mt-2 text-xs text-red-600">
              {favoriteMutation.error.message}
            </p>
          )}
        </section>

        <form
          className="border-t border-gray-200 pt-6 sm:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          onSubmit={saveReview}
        >
          <h2 className="text-xl font-bold">
            내 평점
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            별점을 매기고, 후기를 남겨보세요.
          </p>

          {myRating && (
            <div className="mt-3 rounded-md bg-gray-100 p-3">
              <p className="text-sm font-semibold">
                저장된 평점: {myRating.score}점
              </p>

              <p className="mt-1 text-xs text-gray-600">
                {myRating.comment || "작성한 후기가 없습니다."}
              </p>

              <button
                type="button"
                onClick={handleLoadRating}
                className="mt-2 text-xs font-semibold text-blue-600 underline"
              >
                기존 평점 불러오기
              </button>
            </div>
          )}

          <fieldset className="mt-3 flex gap-2">
            <legend className="sr-only">
              별점 선택
            </legend>

            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                className="relative cursor-pointer"
              >
                <input
                  className="peer sr-only"
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => {
                    setRating(value);
                    setSaved(false);
                  }}
                  aria-label={`${value}점`}
                />

                <span
                  className={cn(
                    "grid size-9 place-items-center rounded border border-gray-200 bg-white text-xl text-gray-500 peer-focus-visible:outline-2 peer-focus-visible:outline-blue-600",
                    value <= rating &&
                      "border-blue-600 text-blue-600",
                  )}
                  aria-hidden="true"
                >
                  ★
                </span>
              </label>
            ))}
          </fieldset>

          <textarea
            className="mt-3 min-h-24 w-full resize-y rounded-md border border-gray-200 bg-white p-3 text-sm placeholder:text-gray-400"
            aria-label="영화 후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            value={review}
            onChange={(event) => {
              setReview(event.target.value);
              setSaved(false);
            }}
          />

          <button
            className="mt-2 w-full rounded-md bg-[#191b1f] py-3 text-xs font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={
              !isLoggedIn ||
              rating === 0 ||
              isSavingRating
            }
          >
            {isSavingRating
              ? "저장 중..."
              : myRating
                ? "평점 수정"
                : "평점 저장"}
          </button>

          {myRating && (
            <button
              type="button"
              onClick={handleDeleteRating}
              disabled={deleteRatingMutation.isPending}
              className="mt-2 w-full rounded-md border border-red-500 py-3 text-xs font-bold text-red-600 disabled:opacity-50"
            >
              {deleteRatingMutation.isPending
                ? "삭제 중..."
                : "평점 삭제"}
            </button>
          )}

          {saved && (
            <p
              className="mt-2 text-xs text-green-600"
              role="status"
            >
              평점 저장 요청이 성공했습니다.
            </p>
          )}

          {ratingError && (
            <p
              className="mt-2 text-xs text-red-600"
              role="alert"
            >
              {ratingError.message}
            </p>
          )}

          {!isLoggedIn && (
            <p className="mt-2 text-xs text-gray-500">
              평점 작성은 로그인 후 이용할 수 있습니다.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}