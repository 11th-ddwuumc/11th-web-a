
import { useEffect, useState } from "react";
import { getPopularMovies } from "../../api/movies";
import type { Movie } from "../../types/movie";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getPopularMovies(
          currentPage,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("영화 목록 조회 실패:", err);
        setError("영화 목록을 불러오지 못했습니다.");
        setMovies([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [currentPage, retryCount]);

  return (
    <main className="mx-auto w-full max-w-[1360px] flex-1 px-5 pt-6 pb-14 sm:px-10">
      <h1 className="mb-5 text-[28px] font-bold tracking-tight sm:text-[34px]">
        영화 목록
      </h1>

      {isLoading ? (
        <div role="status" className="py-20 text-center text-gray-500">
          영화를 불러오는 중입니다...
        </div>
      ) : error ? (
        <div role="alert" className="py-20 text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
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
