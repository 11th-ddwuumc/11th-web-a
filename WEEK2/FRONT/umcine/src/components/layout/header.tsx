import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex h-[52px] w-full items-center justify-between border-b border-gray-200 bg-white px-14">
      {/* 왼쪽: 로고 + 메뉴 */}
      <div className="flex items-center gap-7">
        {/* UMCine 로고 */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/icons/movie-icons/movie.svg"
            alt="UMCine"
            className="h-5 w-5"
          />

          <span className="text-sm font-bold text-gray-900">UMCine</span>
        </Link>

        {/* 메뉴 */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-xs text-gray-600 hover:text-gray-900">
            영화
          </Link>

          <Link to="/search" className="text-xs text-gray-900">
            검색
          </Link>

          <Link to="/" className="text-xs text-gray-600 hover:text-gray-900">
            내정보
          </Link>
        </nav>
      </div>

      {/* 오른쪽: 검색 + 로그인 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt="검색"
            className="h-4 w-4"
          />
        </button>

        <button
          type="button"
          className="h-8 rounded-md bg-blue-500 px-3 text-xs font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
