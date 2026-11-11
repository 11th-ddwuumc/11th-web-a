import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const parsedMovieId = Number(movieId);
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", parsedMovieId],
    queryFn: () => getMovieDetail(parsedMovieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  // 잘못된 ID는 요청하지 않으며, 로딩보다 먼저 처리
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
        <p className="text-lg font-semibold text-gray-700">
          올바르지 않은 영화 번호예요.
        </p>
      </main>
    );
  }

  // 로딩 상태
  if (movieDetailQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
        <p className="text-lg font-semibold text-gray-700">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  // 오류 상태
  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
        <p className="text-lg font-semibold text-gray-700">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </p>
      </main>
    );
  }

  const movie = movieDetailQuery.data;

  // 데이터가 없는 경우
  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
        <p className="text-lg font-semibold text-gray-700">
          영화 정보를 표시할 수 없어요.
        </p>
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const genreText = movie.genres
    .map((genre) => genre.name)
    .join(", ");

  const runtimeText =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  return (
    <main className="min-h-screen bg-[#f4f5f7]">
      {/* 배경 이미지 영역 */}
      <section className="relative h-[360px] overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-400 text-gray-700">
            이미지 없음
          </div>
        )}

        {/* 배경 위 어두운 효과 */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto flex h-full max-w-[1000px] flex-col justify-end px-6 pb-10 text-white">
          <Link
            to="/"
            className="absolute left-6 top-6 text-xs text-white/90 hover:text-white"
          >
            ← 영화 목록
          </Link>

          <h1 className="text-3xl font-bold">
            {movie.title}
          </h1>

          <p className="mt-2 text-sm text-white/80">
            {movie.original_title}
          </p>

          <p className="mt-2 text-xs text-white/80">
            {movie.release_date} · {genreText} · {runtimeText}
          </p>
        </div>
      </section>

      {/* 영화 상세 정보 */}
      <section className="mx-auto grid max-w-[1000px] grid-cols-[115px_1fr_190px] gap-5 px-6 py-6">
        {/* 포스터 */}
        <div>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="w-full rounded-lg object-cover shadow-md"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-gray-300 text-xs text-gray-600 shadow-md">
              이미지 없음
            </div>
          )}
        </div>

        {/* 영화 설명 */}
        <div className="border-r border-gray-200 pr-6">
          <h2 className="text-base font-bold text-gray-900">
            {movie.tagline}
          </h2>

          <p className="mt-4 text-xs leading-6 text-gray-500">
            {movie.overview}
          </p>

          <BookmarkButton movieId={movie.id} />
        </div>

        {/* 내 평점 */}
        <div>
          <h2 className="text-base font-bold text-gray-900">
            내 평점
          </h2>

          <p className="mt-1 text-[10px] text-gray-400">
            별점을 눌러 평가해주세요.
          </p>

          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-400"
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-14 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-[10px] outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            className="mt-2 h-8 w-full rounded-md bg-gray-900 text-xs font-semibold text-white"
          >
            평점 저장
          </button>
        </div>
      </section>
    </main>
  );
}