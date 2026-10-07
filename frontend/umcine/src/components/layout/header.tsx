import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const menuLinkClass = "border-b-2 border-transparent pb-1 text-sm font-semibold text-[#111827]";

export function Header() {
  return (
    <header className="flex h-[72px] w-full shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-12">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <img
            src="/icons/movie-icons/movie.svg"
            alt="UMCine"
            className="h-6 w-6"
          />
          <span className="text-[22px] font-bold text-[#111827]">UMCine</span>
        </div>

        <nav className="flex gap-6">
          <Link
            to="/"
            className={menuLinkClass}
            activeProps={{
              className: cn(menuLinkClass, "border-black"),
            }}
          >
            영화
          </Link>

          <Link
            to="/search"
            className={menuLinkClass}
            activeProps={{
              className: cn(menuLinkClass, "border-black"),
            }}
          >
            검색
          </Link>

          <a href="#" className={menuLinkClass}>
            내 정보
          </a>
        </nav>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt="검색"
            className="h-[18px] w-[18px]"
          />
        </button>

        <button
          type="button"
          className="h-9 w-[60px] rounded-lg border-none bg-[#5B5CEB] text-[13px] font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}