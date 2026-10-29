import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/Pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  let content;

  if (isLoading) {
    content = (
      <p className="flex h-full items-center justify-center text-sm text-gray-500">
        영화 목록을 불러오는 중이에요.
      </p>
    );
  } else if (errorMessage) {
    content = (
      <p className="flex h-full items-center justify-center text-sm text-gray-500">
        {errorMessage}
      </p>
    );
  } else if (movies.length === 0) {
    content = (
      <p className="flex h-full items-center justify-center text-sm text-gray-500">
        조건에 맞는 영화가 없어요.
      </p>
    );
  } else {
    content = (
      <MovieGrid
        movies={movies.slice(0, 10)}
        bookmarkedMovieIds={bookmarkedMovieIds}
        onToggleBookmark={toggleBookmark}
      />
    );
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-6 py-3">
      <h1 className="mb-3 shrink-0 text-2xl font-extrabold text-gray-900">
        영화 목록
      </h1>

      <div className="min-h-0 flex-1">{content}</div>

      <div className="mt-3 flex shrink-0 justify-center">
        <Pagination />
      </div>
    </div>
  );
}
