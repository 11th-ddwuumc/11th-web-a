import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query ?? "");
  const normalizedQuery = query?.trim() ?? "";

  // URL 검색어와 입력창 동기화
  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  // 검색어가 있을 때만 요청하고, 검색어별로 캐시를 구분
  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const movies = searchQuery.data?.results ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-52px)] bg-[#f7f8fa] px-6 py-28">
      <div className="mx-auto w-full max-w-[650px]">
        {/* 검색 제목 */}
        <h1 className="mb-7 text-center text-3xl font-bold tracking-tight text-gray-900">
          어떤 영화를 찾고 있나요?
        </h1>

        {/* 검색창 */}
        <form
          onSubmit={handleSubmit}
          className="flex h-11 w-full items-center rounded-lg border border-gray-900 bg-white px-3 shadow-sm"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="mr-3 h-4 w-4"
          />

          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="예: 스파이더맨"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            className="ml-3 h-8 rounded-md bg-gray-900 px-4 text-xs font-semibold text-white"
          >
            검색
          </button>
        </form>
      </div>

      {/* 검색 결과 */}
      <section className="mx-auto mt-16 max-w-[1000px]">
        {!normalizedQuery ? (
          <p className="py-20 text-center text-sm text-gray-500">
            검색어를 입력해 주세요.
          </p>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                ‘{normalizedQuery}’ 검색 결과
              </h2>

              {searchQuery.isSuccess && (
                <p className="mt-2 text-sm text-gray-500">
                  영화 {movies.length}편
                </p>
              )}
            </div>

            {searchQuery.isLoading ? (
              /* 로딩 */
              <p className="py-20 text-center text-sm text-gray-500">
                검색 결과를 불러오는 중이에요.
              </p>
            ) : searchQuery.isError ? (
              /* 오류 */
              <p className="py-20 text-center text-sm text-red-500">
                검색 결과를 불러오지 못했어요.
              </p>
            ) : searchQuery.isSuccess && movies.length === 0 ? (
              /* 조회는 성공했지만 결과가 없음 */
              <p className="py-20 text-center text-sm text-gray-500">
                검색 결과가 없어요.
              </p>
            ) : searchQuery.isSuccess ? (
              /* 검색 성공 */
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {movies.map((movie) => {
                  const posterUrl = getTmdbPosterUrl(movie.poster_path);

                  return (
                    <li
                      key={movie.id}
                      className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
                    >
                      {/* 포스터 */}
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className="h-44 w-28 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-44 w-28 shrink-0 items-center justify-center rounded-md bg-gray-300 text-xs text-gray-600">
                          이미지 없음
                        </div>
                      )}

                      {/* 영화 정보 */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900">
                          {movie.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {movie.original_title}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          {movie.release_date}
                        </p>

                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                          {movie.overview}
                        </p>

                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="mt-4 inline-block text-xs font-semibold text-blue-500"
                        >
                          상세 보기 →
                        </Link>

                        <BookmarkButton movieId={movie.id} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-20 text-center text-sm text-gray-500">
                검색 요청을 기다리고 있어요. 네트워크 연결을 확인해 주세요.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}