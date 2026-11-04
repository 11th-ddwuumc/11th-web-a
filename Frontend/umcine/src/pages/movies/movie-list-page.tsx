import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import type { MovieCardItem } from "../../types/movie";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function MovieListPage() {
  // 현재 보고 있는 페이지 번호
  const [page, setPage] = useState(1);

  //영화 데이터 요청
  const moviesQuery = useQuery({
    queryKey : ["movies", "list", {page}],
    queryFn: () => getMovies({page}),
  });

  const movies = moviesQuery.data?.results ?? [];

  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const cardMovies: MovieCardItem[] = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date || "개봉일 미정",
    posterPath:  movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : "/icons/movie-icons/movie.svg"
  }));

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  }

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[var(--color-bg-page)]">
      {moviesQuery.isPending ? (
        <p className="py-20 text-center text-[var(--color-text-secondary)]">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="py-20 text-center text-[var(--color-danger-default)]">
          영화 목록을 불러오지 못했어요.
        </p>
      ) : cardMovies.length === 0 ? (
        <p className="py-20 text-center text-[var(--color-text-secondary)]">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <>

        <MovieGrid movies={cardMovies} />

  
          <div className="flex items-center justify-center gap-4 py-8">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              이전
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </>
      )}
    </main>
  );
}
