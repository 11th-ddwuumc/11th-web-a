import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => String(item.id) === movieId);

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1360px] px-5 py-16 sm:px-10">
        <h1 className="mb-6 text-2xl font-bold">영화를 찾을 수 없어요.</h1>
        <Link className="text-blue-600 underline underline-offset-4" to="/">영화 목록으로 돌아가기</Link>
      </main>
    );
  }

  return (
    <main className="pb-16">
      <div className="relative h-56 overflow-hidden bg-gray-900 sm:h-80 lg:h-[420px]">
        <img className="h-full w-full object-cover" src={movie.backdropPath} alt="" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" aria-hidden="true" />
      </div>
      <div className="relative mx-auto -mt-16 max-w-[1360px] px-5 sm:-mt-24 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <img className="aspect-[2/3] w-40 shrink-0 rounded-xl object-cover shadow-xl sm:w-52 lg:w-60" src={movie.posterPath} alt={`${movie.title} 포스터`} />
          <div className="min-w-0 flex-1 sm:pt-28">
            <h1 className="text-3xl leading-tight font-bold tracking-tight lg:text-4xl">{movie.title}</h1>
            <p className="mt-2 text-lg text-gray-500">{movie.originalTitle}</p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-gray-500">개봉일</dt><dd>{movie.releaseDate}</dd>
              <dt className="text-gray-500">장르</dt><dd>{movie.genres.join(" · ")}</dd>
              <dt className="text-gray-500">상영 시간</dt><dd>{movie.runtime}</dd>
            </dl>
          </div>
        </div>
        <section className="mt-10 border-t border-gray-200 pt-8" aria-label="영화 소개">
          <h2 className="text-xl font-bold sm:text-2xl">{movie.tagline}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-gray-600">{movie.overview}</p>
        </section>
        <Link className="mt-10 inline-flex rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-100" to="/">영화 목록으로 돌아가기</Link>
      </div>
    </main>
  );
}
