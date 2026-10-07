import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [searchText, setSearchText] = useState(query ? query : "");

  const [prevQuery, setPrevQuery] = useState(query);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ? query : "");
  }

  const keyword = query ? query.trim().toLowerCase() : "";

  let searchResults: typeof movies = [];

  if (keyword) {
    searchResults = movies.filter((movie) => {
      const inTitle = movie.title.toLowerCase().includes(keyword);
      const inOriginalTitle = movie.originalTitle
        .toLowerCase()
        .includes(keyword);
      return inTitle || inOriginalTitle;
    });
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = searchText.trim();

    if (text) {
      navigate({ search: { query: text } });
    } else {
      navigate({ search: {} });
    }
  }

  function handleClear() {
    setSearchText("");
    navigate({ search: {} });
  }

  const searchForm = (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-lg border border-gray-900 bg-[#f5f5f7] px-3 py-2"
    >
      <img
        src="/icons/movie-icons/search.svg"
        alt=""
        className="h-4 w-4 shrink-0"
      />

      <input
        aria-label="검색어"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="예: 스파이더맨"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />

      {keyword && searchText && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="검색어 지우기"
          className="shrink-0 px-1 text-base text-gray-500"
        >
          ✕
        </button>
      )}

      <button
        type="submit"
        className="shrink-0 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white"
      >
        {keyword ? "다시 검색" : "검색"}
      </button>
    </form>
  );

  if (!keyword) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center bg-[#f5f5f7] px-6 pb-20">
        <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
          어떤 영화를 찾고 있나요?
        </h1>

        <div className="w-full max-w-xl">{searchForm}</div>

        <p className="mt-4 text-sm text-gray-500">검색어를 입력해 주세요.</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto bg-[#f5f5f7]">
      <div className="mx-auto w-full max-w-5xl px-6 py-6">
        <h1 className="text-2xl font-extrabold text-gray-900">영화 검색</h1>

        <div className="mt-4">{searchForm}</div>

        <div className="mt-6 flex items-baseline justify-between border-b border-gray-200 pb-2">
          <h2 className="text-sm font-bold text-gray-900">
            ‘{query}’ 검색 결과
          </h2>
          <span className="text-[11px] text-gray-400">
            총 {searchResults.length}편 · 1페이지
          </span>
        </div>

        {searchResults.length === 0 && (
          <p className="mt-8 text-sm text-gray-500">검색 결과가 없어요.</p>
        )}

        {searchResults.length > 0 && (
          <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                className="flex gap-4 border-b border-gray-200 py-4"
              >
                <img
                  src={movie.posterPath}
                  alt={movie.title + " 포스터"}
                  className="h-36 w-24 shrink-0 rounded-md object-cover"
                />

                <div className="flex min-w-0 flex-col">
                  <h3 className="text-base font-bold text-gray-900">
                    {movie.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {movie.originalTitle} · {movie.releaseDate}
                  </p>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">
                    {movie.overview}
                  </p>

                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="w-fit text-xs font-semibold text-blue-600"
                    >
                      상세 보기 →
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(movie.id)}
                      className={cn(
                        "rounded-md px-2 py-1 text-xs font-semibold",
                        bookmarkedMovieIds.includes(movie.id)
                          ? "bg-[#5b5ce9] text-white"
                          : "bg-gray-200 text-gray-700",
                      )}
                    >
                      {bookmarkedMovieIds.includes(movie.id)
                        ? "북마크 해제"
                        : "북마크"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
