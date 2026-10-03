import { useState } from "react";
import { movies } from "./data/movies";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import "./App.css";

export default function App() {
  const [movieList, setMovieList] = useState(movies);
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 4;
  const totalPages = Math.ceil(movieList.length / moviesPerPage);

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = movieList.slice(startIndex, endIndex);

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
    <>
      <Header />

      <main className="movie-page">
        <h1>영화 목록</h1>

        <MovieGrid
          movies={currentMovies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}