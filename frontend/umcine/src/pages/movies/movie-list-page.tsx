import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/Pagination";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const movieList = movies.map((movie) => {
    return { ...movie, isBookmarked: bookmarkedMovieIds.includes(movie.id) };
  });

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-6 py-3">
      <h1 className="mb-3 shrink-0 text-2xl font-extrabold text-gray-900">
        영화 목록
      </h1>

      <div className="min-h-0 flex-1">
        <MovieGrid movies={movieList} onToggleBookmark={toggleBookmark} />
      </div>

      <div className="mt-3 flex shrink-0 justify-center">
        <Pagination />
      </div>
    </div>
  );
}
