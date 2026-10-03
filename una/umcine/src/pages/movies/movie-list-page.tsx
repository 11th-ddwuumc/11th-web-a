import { useState } from "react";
import { movies } from "../../data/movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [movieList, setMovieList] = useState(movies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(id: number) {
    setMovieList((previousMovies) =>
      previousMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-88px)] max-w-[1360px] px-5 pt-6 pb-16 sm:px-10">
      <h1 className="mb-5 text-[28px] font-bold tracking-tight sm:text-[34px]">영화 목록</h1>

      <MovieGrid
        movies={movieList}
        onToggleBookmark={handleToggleBookmark}
      />

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
