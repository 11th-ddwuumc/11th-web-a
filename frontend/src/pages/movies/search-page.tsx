
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { searchMovies } from "../../api/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  return <SearchContent key={query ?? ""} query={query?.trim()} />;
}

function SearchContent({ query }: { query?: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const [results, setResults] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    if (!normalizedQuery) return;

    const controller = new AbortController();

    async function fetchResults() {
      setIsLoading(true);
      setError(null);
      setResults([]);

      try {
        const data = await searchMovies(
          normalizedQuery,
          1,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setResults(data.results);
        setTotalResults(data.total_results);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("영화 검색 실패:", err);
        setError("검색 결과를 불러오지 못했습니다.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchResults();

    return () => controller.abort();
  }, [normalizedQuery, retryCount]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();
    setSearchText(nextQuery);

    if (nextQuery === normalizedQuery && nextQuery) {
      setRetryCount((count) => count + 1);
      return;
    }

    void navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1360px] flex-1 px-5 pb-16 sm:px-10",
        normalizedQuery ? "pt-6" : "pt-24 sm:pt-44",
      )}
    >
      <h1
        className={cn(
          "mb-5 text-[28px] font-bold tracking-tight sm:text-[34px]",
          !normalizedQuery && "mb-8 text-center",
        )}
      >
        {normalizedQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>

      <form
        className={cn(
          "flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 pl-4",
          !normalizedQuery &&
            "mx-auto max-w-[800px] border-[#191b1f] p-3 pl-5 shadow-lg",
        )}
        role="search"
        onSubmit={handleSubmit}
      >
        <img
          className="size-5 shrink-0"
          src="/icons/search.svg"
          alt=""
        />

        <input
          ref={inputRef}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-gray-400"
          type="text"
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        {searchText && (
          <button
            className="grid size-8 shrink-0 place-items-center"
            type="button"
            aria-label="검색어 지우기"
            onClick={() => {
              setSearchText("");
              inputRef.current?.focus();
            }}
          >
            <img className="size-5" src="/icons/close.svg" alt="" />
          </button>
        )}

        <button
          className="shrink-0 rounded-md bg-[#191b1f] px-4 py-3 text-xs font-bold text-white hover:bg-gray-800"
          type="submit"
        >
          {normalizedQuery ? "다시 검색" : "검색"}
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="mt-5 text-center text-sm text-gray-500">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4">
            <h2 className="wrap-anywhere text-base font-bold">
              ‘{query}’ 검색 결과
            </h2>

            <p className="text-xs text-gray-400" role="status">
              {isLoading
                ? "검색 중..."
                : error
                  ? "검색 실패"
                  : `영화 ${totalResults}편`}
            </p>
          </div>

          {isLoading ? (
            <p role="status" className="py-16 text-center text-gray-500">
              영화를 검색하는 중입니다...
            </p>
          ) : error ? (
            <div role="alert" className="py-16 text-center">
              <p className="mb-4 text-red-500">{error}</p>
              <button
                type="button"
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
                onClick={() => setRetryCount((count) => count + 1)}
              >
                다시 시도
              </button>
            </div>
          ) : results.length === 0 ? (
            <p className="py-16 text-center text-gray-500">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid gap-x-10 md:grid-cols-2">
              {results.map((movie) => {
                const isBookmarked =
                  bookmarkedMovieIds.includes(movie.id);

                return (
                  <li
                    className="flex gap-4 border-b border-gray-200 py-5"
                    key={movie.id}
                  >
                    <Link
                      className="shrink-0 self-start"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <img
                        className="aspect-[2/3] w-24 rounded-lg object-cover sm:w-[124px]"
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold">
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                        >
                          {movie.title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        {movie.originalTitle}
                        <span className="ml-2">
                          {movie.releaseDate}
                        </span>
                      </p>

                      <p className="mt-2 text-xs leading-6 text-gray-500">
                        {movie.overview}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          aria-pressed={isBookmarked}
                          onClick={() => toggleBookmark(movie.id)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-2 text-xs font-bold",
                            isBookmarked &&
                              "border-blue-600 bg-blue-600 text-white",
                          )}
                        >
                          <img
                            className={cn(
                              "size-4",
                              isBookmarked && "brightness-0 invert",
                            )}
                            src={
                              isBookmarked
                                ? "/icons/bookmark.svg"
                                : "/icons/bookmark-outline.svg"
                            }
                            alt=""
                          />

                          {isBookmarked ? "북마크 해제" : "북마크"}
                        </button>

                        <Link
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                        >
                          상세 보기
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {!isLoading && !error && results.length > 0 && (
            <p className="mt-5 text-center text-xs text-gray-400">
              현재 첫 번째 페이지의 검색 결과를 표시하고 있습니다.
            </p>
          )}
        </>
      )}
    </main>
  );
}
