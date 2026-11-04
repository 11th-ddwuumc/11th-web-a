import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

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
          {/* 검색 아이콘 */}
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="mr-3 h-4 w-4"
          />

          {/* 입력창 */}
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="예: 스파이더맨"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />

          {/* 검색 버튼 */}
          <button
            type="submit"
            className="ml-3 h-8 rounded-md bg-gray-900 px-4 text-xs font-semibold text-white"
          >
            검색
          </button>
        </form>
      </div>

      {/* 검색 결과 */}
      {normalizedQuery && (
        <section className="mx-auto mt-16 max-w-[1000px]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              ‘{query}’ 검색 결과
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              영화 {searchResults.length}편
            </p>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-20 text-center text-sm text-gray-500">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
                >
                  {/* 포스터 */}
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-44 w-28 shrink-0 rounded-md object-cover"
                  />

                  {/* 영화 정보 */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900">{movie.title}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {movie.originalTitle}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {movie.releaseDate}
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
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
