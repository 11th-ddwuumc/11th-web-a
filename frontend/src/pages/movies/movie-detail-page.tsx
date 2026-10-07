import { Link, useParams } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => String(item.id) === movieId);

  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-[1360px] px-5 py-16 sm:px-10">
        <h1 className="mb-6 text-2xl font-bold">
          영화를 찾을 수 없어요.
        </h1>

        <Link
          className="text-blue-600 underline underline-offset-4"
          to="/"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return <MovieDetail key={movie.id} movie={movie} />;
}

function MovieDetail({ movie }: { movie: Movie }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <main className="flex-1 pb-16">
      <section
        className="relative h-[340px] bg-gray-900 text-white lg:h-[360px]"
        aria-label="영화 정보"
      >
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
        />

        <div
          className="absolute inset-0 bg-linear-to-r from-black/65 via-black/20 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full max-w-[1360px] flex-col justify-between px-5 py-6 sm:px-10">
          <Link
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold"
            to="/"
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
              {movie.releaseDate} · {movie.genres.join(" · ")} ·{" "}
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
            {movie.tagline}
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {movie.overview}
          </p>

          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-xs font-bold text-white",
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
            즐겨찾기
          </button>
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
                  required
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
            className="mt-2 w-full rounded-md bg-[#191b1f] py-3 text-xs font-bold text-white hover:bg-gray-800"
            type="submit"
          >
            평점 저장
          </button>

          <p
            className="mt-2 text-xs text-gray-500"
            role="status"
          >
            {saved
              ? "이 화면에 저장했어요. 페이지를 벗어나면 초기화돼요."
              : ""}
          </p>
        </form>
      </div>
    </main>
  );
}