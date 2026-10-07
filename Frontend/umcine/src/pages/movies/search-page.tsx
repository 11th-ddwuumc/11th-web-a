import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query }  = useSearch({ from: "/search" });
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
    <main className="flex min-h-screen w-full
                    flex-col items-center justify-center pl-[80px] pr-[80px]
                    pt-[25px] bg-[var(--color-bg-page)] text-center">
      <h1 className="font-['Pretendard']
                    text-[46px] font-bold mb-[36px] ">
        어떤 영화를 찾고 있나요?</h1>
      <form onSubmit={handleSubmit}
             className="flex h-[74px] w-full self-stretch
                    items-center gap-[14px]  rounded-[12px]
                    border-2 border-[var(--color-text-primary)]
                    bg-[var(--color-bg-surface)]
                    p-[21px]"
        >
         <img
            src="/icons/movie-icons/search.svg"
            alt="검색"
            className="h-[17px] w-[17px] shrink-0 opacity-50"
        />

        <input
          aria-label="검색어"
          value={searchText}
          placeholder="예: 스파이더맨"
          onChange={(event) => setSearchText(event.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent
          font-['Pretendard'] text-sm
          outline-none
          placeholder:text-[var(--color-text-tertiary)]"
        />
        <button type="submit"
                className="shrink-0 rounded-[8px]
                bg-[var(--color-text-primary)]  px-4 py-[10px]
                font-['Pretendard']
                text-xs font-bold
                text-white
                cursor-pointer"
        >
        검색</button>
      </form>

      {!normalizedQuery ? (
        <p>검색어를 입력해 주세요.</p>
      ) : (
        <>
          <div className="flex items-center justify-between">
             <h2 className="text-[18px] font-bold mt-[16.5px] mb-[16.5px]">‘{query}’ 검색 결과</h2>
             <p>영화 {searchResults.length}편</p>
          </div>
          <hr></hr>
          {searchResults.length === 0 ? (
            <p>검색 결과가 없어요.</p>
          ) : (
            <ul>
              {searchResults.map((movie) => (
                <li key={movie.id}>
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
                  <h3>{movie.title}</h3>
                  <p>{movie.originalTitle}</p>
                  <p>{movie.releaseDate}</p>
                  <p>{movie.overview}</p>
                  <BookmarkButton movieId={movie.id} />

                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    상세 보기
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
