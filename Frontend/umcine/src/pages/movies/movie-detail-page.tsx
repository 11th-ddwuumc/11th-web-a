import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

function formatRuntime(runtime: number | null) {
  if (runtime === null) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovieDetail() {
      setMovie(null);
      setErrorMessage(null);

      if (!isValidMovieId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);

        if (!ignore) {
          setMovie(response);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [isValidMovieId, parsedMovieId]);

  if (!isValidMovieId) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold">올바르지 않은 영화 번호예요.</h1>
          <Link
            to="/"
            className="mt-4 inline-block font-bold text-[var(--color-action-primary)]"
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4 text-center text-[var(--color-text-secondary)]">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold">
            {errorMessage ?? "영화 정보를 불러오지 못했어요."}
          </h1>
          <Link
            to="/"
            className="mt-4 inline-block font-bold text-[var(--color-action-primary)]"
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const posterUrl = movie.poster_path
    ? `${TMDB_POSTER_BASE_URL}${movie.poster_path}`
    : "/icons/movie-icons/movie.svg";
  const backdropUrl = movie.backdrop_path
    ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}`
    : posterUrl;
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");
  const runtimeText = formatRuntime(movie.runtime);

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[var(--color-bg-page)] pb-16">
      <div className="relative h-[260px] overflow-hidden sm:h-[360px] lg:h-[440px]">
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>

      <div className="mx-auto -mt-24 grid w-full max-w-6xl gap-8 px-4 sm:px-8 md:grid-cols-[220px_1fr] lg:px-10">
        <img
          src={posterUrl}
          alt={`${movie.title} 포스터`}
          className="relative z-10 aspect-[2/3] w-full max-w-[220px] rounded-xl object-cover shadow-xl"
        />

        <section className="relative z-10 self-end rounded-2xl bg-white/95 p-6 shadow-lg backdrop-blur sm:p-8">
          <Link
            to="/"
            className="text-sm font-bold text-[var(--color-action-primary)] no-underline hover:underline"
          >
            ← 영화 목록
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {movie.title}
              </h1>
              <p className="mt-1 text-[var(--color-text-secondary)]">
                {movie.original_title}
              </p>
            </div>
            <BookmarkButton movieId={movie.id} />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--color-text-secondary)]">
            <span>{movie.release_date || "개봉일 미정"}</span>
            <span aria-hidden="true">·</span>
            <span>{genreNames || "장르 정보 없음"}</span>
            <span aria-hidden="true">·</span>
            <span>{runtimeText}</span>
          </div>

          <h2 className="mt-8 text-xl font-bold">{movie.tagline}</h2>
          <p className="mt-3 leading-7 text-[var(--color-text-secondary)]">
            {movie.overview}
          </p>
        </section>
      </div>
    </main>
  );
}
