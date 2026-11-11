import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";

import MovieGrid from "../../components/movie-grid";
import "./movie-list-page.css";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(
    moviesQuery.data?.total_pages ?? 0,
    500,
  );

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main>
      <h2>영화 목록</h2>

      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p>영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />

          <nav
            aria-label="영화 목록 페이지 이동"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              margin: "24px 0",
            }}
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
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
            >
              다음
            </button>
          </nav>
        </>
      )}

      {moviesQuery.isError && page > 1 && (
        <button
          type="button"
          onClick={() => handlePageChange(page - 1)}
        >
          이전 페이지로 돌아가기
        </button>
      )}
    </main>
  );
}