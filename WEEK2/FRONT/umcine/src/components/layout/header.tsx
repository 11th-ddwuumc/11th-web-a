
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="flex h-[52px] w-full items-center justify-between border-b border-gray-200 bg-white px-14">
      {/* 왼쪽: 로고 + 메뉴 */}
      <div className="flex items-center gap-7">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/icons/movie-icons/movie.svg"
            alt="UMCine"
            className="h-5 w-5"
          />
          <span className="text-sm font-bold text-gray-900">
            UMCine
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            영화
          </Link>

          <Link to="/search" className="text-xs text-gray-900">
            검색
          </Link>

          <Link
            to="/my"
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            내정보
          </Link>
        </nav>
      </div>

      {/* 오른쪽: 검색 + 로그인 상태 */}
      <div className="flex items-center gap-2">
        <Link
          to="/search"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt="검색"
            className="h-4 w-4"
          />
        </Link>

        {!accessToken ? (
          <Link
            to="/login"
            className="flex h-8 items-center rounded-md bg-blue-500 px-3 text-xs font-semibold text-white"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />
        ) : (
          <Link
            to="/my"
            className="flex h-8 items-center rounded-md bg-blue-500 px-3 text-xs font-semibold text-white"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}
