import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import type { MovieCardItem } from "../../types/movie";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

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

  const cardMovies: MovieCardItem[] = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date || "개봉일 미정",
    posterPath: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : "/icons/movie-icons/movie.svg",
  }));

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[var(--color-bg-page)]">
      {isLoading ? (
        <p className="py-20 text-center text-[var(--color-text-secondary)]">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p className="py-20 text-center text-[var(--color-danger-default)]">
          {errorMessage}
        </p>
      ) : cardMovies.length === 0 ? (
        <p className="py-20 text-center text-[var(--color-text-secondary)]">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <MovieGrid movies={cardMovies} />
      )}
    </main>
  );
}
