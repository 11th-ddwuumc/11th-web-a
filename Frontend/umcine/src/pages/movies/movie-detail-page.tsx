import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold">영화를 찾을 수 없어요.</h1>
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

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[var(--color-bg-page)] pb-16">
      <div className="relative h-[260px] overflow-hidden sm:h-[360px] lg:h-[440px]">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>

      <div className="mx-auto -mt-24 grid w-full max-w-6xl gap-8 px-4 sm:px-8 md:grid-cols-[220px_1fr] lg:px-10">
        <img
          src={movie.posterPath}
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
                {movie.originalTitle}
              </p>
            </div>
            <BookmarkButton movieId={movie.id} />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--color-text-secondary)]">
            <span>{movie.releaseDate}</span>
            <span aria-hidden="true">·</span>
            <span>{movie.genres.join(" · ")}</span>
            <span aria-hidden="true">·</span>
            <span>{movie.runtime}</span>
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
