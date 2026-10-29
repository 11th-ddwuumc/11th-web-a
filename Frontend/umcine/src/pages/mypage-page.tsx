import MovieCard from "../components/movies/movie-card";
import { movies } from "../data/movies";
import { useBookmarkStore } from "../stores/bookmark-store";

export function MypagePage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const bookmarkedMovies = movies.filter((movie) =>
    bookmarkedMovieIds.includes(movie.id),
  );

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[var(--color-bg-page)] px-4 py-8 sm:px-8 lg:px-20">
      <h1 className="text-3xl font-bold sm:text-[38px]">마이페이지</h1>
      <p className="mt-2 text-[var(--color-text-secondary)]">
        북마크한 영화 {bookmarkedMovies.length}편
      </p>

      {bookmarkedMovies.length === 0 ? (
        <p className="py-20 text-center text-[var(--color-text-secondary)]">
          아직 북마크한 영화가 없어요.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
          {bookmarkedMovies.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
