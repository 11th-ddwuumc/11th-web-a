import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  return <SearchContent key={query ?? ""} query={query?.trim()} />;
}

interface SearchContentProps {
  query?: string;
}

function SearchContent({ query }: SearchContentProps) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();
    setSearchText(nextQuery);

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-88px)] max-w-[1360px] px-5 pt-6 pb-16 sm:px-10">
      <h1 className="mb-6 text-[28px] font-bold tracking-tight sm:text-[34px]">영화 검색</h1>

      <form className="mb-10 flex gap-3" role="search" onSubmit={handleSubmit}>
        <input
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400"
          type="search"
          aria-label="검색어"
          placeholder="영화 제목을 입력해 주세요."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button className="shrink-0 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700" type="submit">검색</button>
      </form>

      {!normalizedQuery ? (
        <p className="py-16 text-center text-gray-500">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <h2 className="wrap-anywhere text-xl font-bold">‘{query}’ 검색 결과</h2>
          <p className="mt-2 mb-6 text-sm text-gray-500" role="status">영화 {searchResults.length}편</p>

          {searchResults.length === 0 ? (
            <p className="py-16 text-center text-gray-500">검색 결과가 없어요.</p>
          ) : (
            <ul className="space-y-5">
              {searchResults.map((movie) => (
                <li className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 min-[380px]:flex-row sm:gap-6 sm:p-6" key={movie.id}>
                  <Link className="shrink-0 self-start" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                  <img
                    className="aspect-[2/3] w-24 rounded-lg object-cover sm:w-[120px]"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    width={120}
                  />
                  </Link>
                  <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold sm:text-xl"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h3>
                  <p className="mt-1 text-sm text-gray-500">{movie.originalTitle}</p>
                  <p className="mt-3 text-xs text-gray-500">개봉일: {movie.releaseDate}</p>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{movie.overview}</p>
                  <Link className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                    상세 보기
                  </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
