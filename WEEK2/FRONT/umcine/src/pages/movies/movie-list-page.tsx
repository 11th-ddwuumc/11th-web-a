import MovieGrid from "../../components/movie-grid";
import { movies as initialMovies } from "../../data/movies";
import "./movie-list-page.css";
import Pagination from "../../components/pagination";

export function MovieListPage() {
  return (
    <>
      <main>
        <h2>영화 목록</h2>

        <MovieGrid movies={initialMovies} />
      </main>
      <Pagination />
    </>
  );
}
