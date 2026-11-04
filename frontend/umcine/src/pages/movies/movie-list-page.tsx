import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/Pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
    placeholderData: keepPreviousData,
  });

  const movies = moviesQuery.data ? moviesQuery.data.results : [];
  const totalPages = moviesQuery.data
    ? Math.min(moviesQuery.data.total_pages, 500)
    : 0;

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  let content;

  if (moviesQuery.isPending) {
    content = (
      <p className="flex h-full items-center justify-center text-sm text-gray-500">
        영화 목록을 불러오는 중이에요.
      </p>
    );
  } else if (moviesQuery.isError) {
    content = (
      <p className="flex h-full items-center justify-center text-sm text-gray-500">
        영화 목록을 불러오지 못했어요.
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
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
