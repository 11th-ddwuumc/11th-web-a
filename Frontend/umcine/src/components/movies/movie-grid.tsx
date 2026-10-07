import { movies } from "../../data/movies";
import MovieCard from "./movie-card";

export default function MovieGrid() {

  return (
    <section
      className="
        flex w-full flex-col items-start gap-5
        bg-[var(--color-bg-page)]
        px-20 py-6
        box-border
      "
    >
      <h1
        className="
          m-0
          font-['Pretendard']
          text-[38px] font-bold leading-[44px]
          tracking-[-1.71px]
          text-[var(--color-text-primary)]
        "
      >
        영화목록
      </h1>

      <div
        className="
          grid w-full grid-cols-1 gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        "
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}