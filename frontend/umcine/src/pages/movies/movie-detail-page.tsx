import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

interface DetailResult {
  movieId: number;
  movie: TmdbMovieDetail | null;
  errorMessage: string | null;
}

function formatRuntime(runtime: number | null) {
  if (runtime === null || runtime <= 0) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }
  if (minutes === 0) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${minutes}분`;
}

function PageMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#f5f5f7]">
      <p className="text-lg font-semibold text-gray-700">{message}</p>
    </div>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [result, setResult] = useState<DetailResult | null>(null);
  const parsedMovieId = Number(movieId);
  const isValidId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  useEffect(() => {
    if (!isValidId) {
      return;
    }

    let ignore = false;

    getMovieDetail(parsedMovieId)
      .then((movie) => {
        if (!ignore) {
          setResult({ movieId: parsedMovieId, movie, errorMessage: null });
        }
      })
      .catch((error) => {
        if (!ignore) {
          setResult({
            movieId: parsedMovieId,
            movie: null,
            errorMessage: getMovieDetailErrorMessage(error),
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [isValidId, parsedMovieId]);

  const currentResult =
    result !== null && result.movieId === parsedMovieId ? result : null;

  if (!isValidId) {
    return <PageMessage message="올바르지 않은 영화 번호예요." />;
  }

  if (currentResult === null) {
    return <PageMessage message="영화 정보를 불러오는 중이에요." />;
  }

  if (currentResult.movie === null) {
    return (
      <PageMessage
        message={
          currentResult.errorMessage
            ? currentResult.errorMessage
            : "영화 정보를 불러오지 못했어요."
        }
      />
    );
  }

  const movie = currentResult.movie;
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

  const releaseDateText = movie.release_date
    ? movie.release_date.replace(/-/g, ".")
    : "개봉일 정보 없음";
  const genreText =
    movie.genres.length > 0
      ? movie.genres.map((genre) => genre.name).join(" · ")
      : "장르 정보 없음";

  let bookmarkIcon = "/icons/movie-icons/bookmark-outline.svg";
  if (isBookmarked) {
    bookmarkIcon = "/icons/movie-icons/bookmark.svg";
  }

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto bg-[#f5f5f7]">
      <section className="relative h-[220px] overflow-hidden bg-gray-700 md:h-[300px]">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-5xl px-6 pb-8">
          <Link
            to="/"
            className="mb-6 inline-flex text-sm font-medium text-white/80 hover:text-white"
          >
            ← 영화 목록
          </Link>

          <div className="text-left text-white">
            <h1 className="text-3xl font-extrabold md:text-4xl">
              {movie.title}
            </h1>
            <p className="mt-2 text-base text-white/90">
              {movie.original_title}
            </p>
            <p className="mt-2 text-sm text-white/80">
              {releaseDateText} · {genreText} · {formatRuntime(movie.runtime)}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-6 md:grid-cols-[200px_1fr_240px]">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title + " 포스터"}
            className="w-[200px] rounded-lg object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-[300px] w-[200px] items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
            이미지 없음
          </div>
        )}

        <div className="text-left">
          {movie.tagline && (
            <h2 className="text-xl font-bold text-gray-900">{movie.tagline}</h2>
          )}

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {movie.overview ? movie.overview : "줄거리 정보가 없어요."}
          </p>

          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white",
              isBookmarked ? "bg-[#5b5ce9]" : "bg-gray-900",
            )}
          >
            <img
              src={bookmarkIcon}
              alt=""
              className="h-[18px] w-[18px] brightness-0 invert"
            />
            <span>즐겨찾기</span>
          </button>
        </div>

        <aside className="border-t border-gray-200 pt-5 text-left md:border-l md:border-t-0 md:pl-6">
          <h3 className="font-bold text-gray-900">내 평점</h3>
          <p className="mt-1 text-xs text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="mt-3 flex gap-1">
            <span className="text-xl text-gray-300">★</span>
            <span className="text-xl text-gray-300">★</span>
            <span className="text-xl text-gray-300">★</span>
            <span className="text-xl text-gray-300">★</span>
            <span className="text-xl text-gray-300">★</span>
          </div>

          <textarea
            aria-label="후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-4 h-24 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none"
          />

          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </div>
  );
}
