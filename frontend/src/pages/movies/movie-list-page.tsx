import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPopularMovies } from "../../api/movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: currentPage }],
    queryFn: () => getPopularMovies(currentPage),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(
    moviesQuery.data?.total_pages ?? 1,
    500,
  );

  return (
    <main className="mx-auto w-full max-w-[1360px] flex-1 px-5 pt-6 pb-14 sm:px-10">
      <h1 className="mb-5 text-[28px] font-bold tracking-tight sm:text-[34px]">
        영화 목록
      </h1>

      {moviesQuery.isPending ? (
        <div role="status" className="py-20 text-center text-gray-500">
          영화를 불러오는 중입니다...
        </div>
      ) : moviesQuery.isError ? (
        <div role="alert" className="py-20 text-center">
          <p className="mb-4 text-red-500">
            영화 목록을 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={() => moviesQuery.refetch()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            다시 시도
          </button>
        </div>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-gray-500">
          표시할 영화가 없습니다.
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </main>
  );
}
