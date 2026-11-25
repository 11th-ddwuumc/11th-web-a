"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const menuBaseClass = "border-b-2 pb-1 text-sm font-semibold text-[#111827]";

const authButtonClass =
  "flex h-9 items-center rounded-lg bg-[#5B5CEB] px-4 text-[13px] font-semibold text-white";

export function Header() {
  const pathname = usePathname();

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const isMovieMenu = pathname === "/" || pathname.startsWith("/movies");
  const isSearchMenu = pathname.startsWith("/search");
  const isMyMenu = pathname.startsWith("/my");

  let rightButton;
  if (!accessToken) {
    rightButton = (
      <Link href="/login" className={authButtonClass}>
        로그인
      </Link>
    );
  } else if (meQuery.isLoading) {
    rightButton = (
      <span className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
    );
  } else {
    rightButton = (
      <Link href="/my" className={authButtonClass}>
        마이페이지
      </Link>
    );
  }

  return (
    <header className="w-full shrink-0 border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#111827]">
              <img
                src="/icons/movie-icons/movie.svg"
                alt=""
                className="h-5 w-5"
              />
            </span>
            <span className="text-[22px] font-bold text-[#111827]">UMCine</span>
          </Link>

          <nav className="flex gap-6">
            <Link
              href="/"
              className={cn(
                menuBaseClass,
                isMovieMenu ? "border-[#111827]" : "border-transparent",
              )}
            >
              영화
            </Link>

            <Link
              href="/search"
              className={cn(
                menuBaseClass,
                isSearchMenu ? "border-[#111827]" : "border-transparent",
              )}
            >
              검색
            </Link>

            <Link
              href="/my"
              className={cn(
                menuBaseClass,
                isMyMenu ? "border-[#111827]" : "border-transparent",
              )}
            >
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white"
          >
            <img
              src="/icons/movie-icons/search.svg"
              alt="검색"
              className="h-[18px] w-[18px]"
            />
          </Link>

          {rightButton}
        </div>
      </div>
    </header>
  );
}
