
import { tmdbClient } from "./tmdb";
import type { Movie } from "../types/movie";

interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

function formatDate(date: string): string {
  return date ? date.replaceAll("-", ".") : "개봉일 미정";
}

export function toMovie(movie: TmdbMovie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: formatDate(movie.release_date),
    posterPath: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/images/placeholder.png",
    backdropPath: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : "",
    genres: [],
    runtime: "",
    tagline: "",
    overview: movie.overview,
  };
}

export async function getPopularMovies(
  page = 1,
  signal?: AbortSignal,
): Promise<MovieListResponse> {
  const data = await tmdbClient
    .get("movie/popular", {
      searchParams: {
        language: "ko-KR",
        page,
      },
      signal,
    })
    .json<TmdbMovieListResponse>();

  return {
    page: data.page,
    results: data.results.map(toMovie),
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}


export async function searchMovies(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<MovieListResponse> {
  const data = await tmdbClient
    .get("search/movie", {
      searchParams: {
        query,
        language: "ko-KR",
        page,
        include_adult: "false",
      },
      signal,
    })
    .json<TmdbMovieListResponse>();

  return {
    page: data.page,
    results: data.results.map(toMovie),
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}


interface TmdbMovieDetail extends TmdbMovie {
  genres: {
    id: number;
    name: string;
  }[];
  runtime: number | null;
  tagline: string;
}

function formatRuntime(minutes: number | null): string {
  if (minutes === null || minutes <= 0) {
    return "상영 시간 정보 없음";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}분`;
  if (remainingMinutes === 0) return `${hours}시간`;

  return `${hours}시간 ${remainingMinutes}분`;
}

export async function getMovieDetail(
  movieId: number,
  signal?: AbortSignal,
): Promise<Movie> {
  const data = await tmdbClient
    .get(`movie/${movieId}`, {
      searchParams: {
        language: "ko-KR",
      },
      signal,
    })
    .json<TmdbMovieDetail>();

  return {
    ...toMovie(data),
    genres: data.genres.map((genre) => genre.name),
    runtime: formatRuntime(data.runtime),
    tagline: data.tagline,
  };
}
