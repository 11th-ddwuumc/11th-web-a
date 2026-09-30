import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/Pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  const [movieList, setMovieList] = useState(movies);


  function handleToggleBookmark(movieId: number) {
    const newList = movieList.map((movie) => {
      if (movie.id === movieId) {
        return { ...movie, isBookmarked: !movie.isBookmarked };
      }
      return movie;
    });
    setMovieList(newList);
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-6 py-3">
      <h1 className="mb-3 shrink-0 text-2xl font-extrabold text-gray-900">
        영화 목록
      </h1>

      <div className="min-h-0 flex-1">
        <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />
      </div>

      <div className="mt-3 flex shrink-0 justify-center">
        <Pagination />
      </div>
    </div>
  );
}
