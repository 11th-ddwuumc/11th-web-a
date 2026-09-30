import { useState } from "react";
import { movies } from "./data/movies";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import "./App.css";

export default function App() {
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
    <>
      <Header />

      <main className="movie-page">
        <h1>영화 목록</h1>

        <MovieGrid
          movies={movieList}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}