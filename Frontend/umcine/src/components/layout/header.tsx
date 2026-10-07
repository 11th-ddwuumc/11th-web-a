import { Link } from "@tanstack/react-router";

const menuClass =
  "font-['Pretendard'] text-sm font-bold text-[var(--color-text-secondary)] no-underline";

const activeMenuClass =
  "text-[var(--color-text-primary)] underline";

export function Header() {
  return (
    <header
      className="
        flex items-center gap-6
        bg-[var(--color-bg-surface)]
        py-6 pl-20
      "
    >
      <Link to="/">
        <img
          src="/icons/movie-icons/umcine.svg"
          alt="UMCine 로고"
        />
      </Link>

      <nav className="flex items-center gap-6">
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
          className="
            flex h-[42px] w-[42px]
            items-center justify-center
            rounded-lg
            border border-[var(--color-border-default)]
            bg-[var(--color-bg-surface)]
          "
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="h-6 w-6"
          />
        </Link>

       <Link
        to="/myPage"
        className="
            flex h-[42px] items-center justify-center
            rounded-lg
            bg-[var(--color-action-primary)]
            px-4
            font-['Pretendard']
            text-sm font-extrabold
            text-[var(--color-bg-surface)]
            no-underline
        "
        >
        마이페이지
        </Link>
      </div>
    </header>
  );
}