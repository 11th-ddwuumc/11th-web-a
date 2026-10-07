import { useState } from "react";
import { movies } from "../../data/movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 4;
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = movies.slice(
    startIndex,
    startIndex + moviesPerPage,
  );

  return (
    <main className="mx-auto w-full max-w-[1360px] flex-1 px-5 pt-6 pb-14 sm:px-10">
      <h1 className="mb-5 text-[28px] font-bold tracking-tight sm:text-[34px]">
        영화 목록
      </h1>

      <MovieGrid movies={currentMovies} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}