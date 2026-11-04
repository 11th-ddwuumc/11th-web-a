import { Link } from "@tanstack/react-router";

const menuClass =
  "whitespace-nowrap text-sm font-bold text-[var(--color-text-secondary)] no-underline transition-colors hover:text-[var(--color-text-primary)]";

const activeMenuClass =
  "text-[var(--color-text-primary)] underline";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center gap-4 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-4 sm:flex-nowrap sm:gap-6 sm:px-8 lg:px-20 lg:py-6">
      <Link
        to="/"
        aria-label="UMCine 홈"
        className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)]"
      >
        <img
          src="/icons/movie-icons/umcine.svg"
          alt="UMCine 로고"
          className="h-auto w-[120px] sm:w-auto"
        />
      </Link>

      <nav
        className="order-3 flex w-full items-center gap-4 sm:order-none sm:w-auto lg:gap-6"
        aria-label="주요 메뉴"
      >
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className={menuClass}
          activeProps={{
            className: activeMenuClass,
          }}
        >
          영화
        </Link>

        <Link
          to="/search"
          className={menuClass}
          activeProps={{
            className: activeMenuClass,
          }}
        >
          검색
        </Link>

        <Link
          to="/myPage"
          className={menuClass}
          activeProps={{
            className: activeMenuClass,
          }}
        >
          내정보
        </Link>  

      </nav>

      <div className="ml-auto flex items-center gap-[10px]">
        <Link
          to="/search"
          aria-label="검색"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] transition-colors hover:bg-[var(--color-bg-page)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)]"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="h-6 w-6"
          />
        </Link>

        <Link
          to="/myPage"
          className="hidden h-[42px] items-center justify-center rounded-lg bg-[var(--color-action-primary)] px-4 text-sm font-extrabold text-white no-underline transition-colors hover:bg-[var(--color-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)] sm:flex"
        >
          마이페이지
        </Link>
      </div>
    </header>
  );
}
