import { useNavigate, useSearch } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { movies } from "../../data/movies";
import MovieCard from "../../components/movies/movie-card";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

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
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("query") ?? "").trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[var(--color-bg-page)] px-4 py-10 sm:px-8 lg:px-20">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-9 text-center text-[34px] font-bold leading-tight tracking-[-1.7px] sm:text-[46px] sm:leading-[52.44px] sm:tracking-[-2.3px]">
          어떤 영화를 찾고 있나요?
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex h-[74px] w-full items-center gap-[14px] rounded-[12px] border-2 border-[var(--color-text-primary)] bg-[var(--color-bg-surface)] py-0 pl-[21px] pr-[10px] shadow-[0_12px_34px_0_rgba(17,19,24,0.08)] focus-within:border-[var(--color-action-primary)]"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="h-[17px] w-[17px] shrink-0 opacity-50"
        />

          <input
            key={query ?? ""}
            type="search"
            name="query"
            aria-label="검색어"
            defaultValue={query ?? ""}
            placeholder="예: 스파이더맨"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--color-text-tertiary)]"
          />

          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-[8px] bg-[var(--color-text-primary)] px-4 py-[10px] text-xs font-bold text-white transition-colors hover:bg-[var(--color-action-hover)]"
          >
            검색
          </button>
        </form>

        {!normalizedQuery ? (
          <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
            검색어를 입력해 주세요.
          </p>
        ) : (
          <section className="mt-8" aria-live="polite">
            <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-4">
              <h2 className="text-lg font-bold">‘{query}’ 검색 결과</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                영화 {searchResults.length}편
              </p>
            </div>

            {searchResults.length === 0 ? (
              <p className="py-16 text-center text-[var(--color-text-secondary)]">
                검색 결과가 없어요.
              </p>
            ) : (
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-5">
                {searchResults.map((movie) => (
                  <li key={movie.id}>
                    <MovieCard movie={movie} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
