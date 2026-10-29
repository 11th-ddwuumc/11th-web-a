import { movies } from "../../data/movies";
import MovieCard from "./movie-card";

export default function MovieGrid() {
  return (
    <section className="flex w-full flex-col items-start gap-5 bg-[var(--color-bg-page)] px-4 py-6 sm:px-8 lg:px-20">
      <h1 className="m-0 text-[32px] font-bold leading-tight tracking-[-1.5px] text-[var(--color-text-primary)] sm:text-[38px] sm:leading-[44px] sm:tracking-[-1.71px]">
        영화목록
      </h1>

      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
