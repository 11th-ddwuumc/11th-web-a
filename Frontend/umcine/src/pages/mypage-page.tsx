import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getFavorites } from "../api/favorites/favorites";
import { getMe } from "../api/members/me";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import MovieCard from "../components/movies/movie-card";
import type { MovieCardItem } from "../types/movie";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function MypagePage() {
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    retry: false,
  });
  const favoriteMovieQueries = useQueries({
    queries: (favoritesQuery.data ?? []).map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const favoriteMovies: MovieCardItem[] = favoriteMovieQueries.flatMap(
    (query) => {
      if (!query.data) return [];
      return [{
        id: query.data.id,
        title: query.data.title,
        releaseDate: query.data.release_date || "개봉일 미정",
        posterPath: query.data.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${query.data.poster_path}`
          : "/icons/movie-icons/movie.svg",
      }];
    },
  );
  const isFavoriteMoviesLoading = favoriteMovieQueries.some(
    (query) => query.isPending,
  );

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[var(--color-bg-page)] px-4 py-8 sm:px-8 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[var(--color-action-primary)]">MY PROFILE</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-[38px]">내 정보</h1>
            <p className="mt-2 text-[var(--color-text-secondary)]">서버에 저장된 회원 정보와 즐겨찾기를 확인할 수 있어요.</p>
          </div>
          <Link to="/myPage/edit" className="inline-flex h-11 items-center rounded-xl border border-[var(--color-border-default)] bg-white px-5 text-sm font-bold text-[var(--color-text-primary)] no-underline transition hover:border-[var(--color-action-primary)] hover:text-[var(--color-action-primary)]">
            정보 수정
          </Link>
        </div>

        <section className="mt-8 rounded-3xl border border-[var(--color-border-default)] bg-white p-6 shadow-[0_14px_40px_rgba(17,19,24,0.06)] sm:p-8">
          {meQuery.isPending ? (
            <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
          ) : meQuery.isError ? (
            <p className="text-[var(--color-danger-default)]">내 정보를 불러오지 못했어요.</p>
          ) : (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-blue-100 text-2xl font-extrabold text-[var(--color-action-primary)]">
                {meQuery.data.nickname.slice(0, 1).toUpperCase()}
              </div>
              <dl className="grid flex-1 gap-5 sm:grid-cols-3">
                <div><dt className="text-sm text-[var(--color-text-secondary)]">닉네임</dt><dd className="mt-1 text-lg font-bold">{meQuery.data.nickname}</dd></div>
                <div><dt className="text-sm text-[var(--color-text-secondary)]">이메일</dt><dd className="mt-1 break-all text-lg font-bold">{meQuery.data.email}</dd></div>
                <div><dt className="text-sm text-[var(--color-text-secondary)]">가입일</dt><dd className="mt-1 text-lg font-bold">{new Date(meQuery.data.createdAt).toLocaleDateString("ko-KR")}</dd></div>
              </dl>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">즐겨찾기한 영화</h2>
          <p className="mt-2 text-[var(--color-text-secondary)]">총 {favoritesQuery.data?.length ?? 0}편</p>

          {favoritesQuery.isPending || isFavoriteMoviesLoading ? (
            <p className="py-16 text-center text-[var(--color-text-secondary)]">즐겨찾기를 불러오는 중이에요.</p>
          ) : favoritesQuery.isError ? (
            <p className="py-16 text-center text-[var(--color-danger-default)]">즐겨찾기를 불러오지 못했어요.</p>
          ) : favoriteMovies.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-[var(--color-border-default)] bg-white py-16 text-center text-[var(--color-text-secondary)]">아직 즐겨찾기한 영화가 없어요.</p>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
              {favoriteMovies.map((movie) => <li key={movie.id}><MovieCard movie={movie} /></li>)}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
