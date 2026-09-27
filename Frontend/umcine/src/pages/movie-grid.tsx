import { movies } from "../data/movies";
import MovieCard from "./movie-card";

export default function MovieGrid() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "24px 80px",
        gap: "20px",
        width: "100%",
        boxSizing: "border-box",
        background: "var(--color-bg-page)",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: "var(--color-text-primary)",
          fontFamily: "Pretendard",
          fontSize: "38px",
          fontWeight: 700,
          lineHeight: "44px",
          letterSpacing: "-1.71px",
        }}
      >
        영화목록
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: "20px",
          width: "100%",
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}