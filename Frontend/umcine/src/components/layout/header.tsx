"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

const menuClass =
  "whitespace-nowrap text-sm font-bold text-[var(--color-text-secondary)] no-underline transition-colors hover:text-[var(--color-text-primary)]";

const activeMenuClass =
  "text-[var(--color-text-primary)] underline";

export function Header() {
  const pathname = usePathname() ?? "";
  const isProfile = pathname === "/myPage" || pathname.startsWith("/myPage/");
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center gap-4 border-b border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-4 sm:flex-nowrap sm:gap-6 sm:px-8 lg:px-20 lg:py-6">
      <Link
        href="/"
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
          href="/"
          className={cn(menuClass, pathname === "/" && activeMenuClass)}
        >
          영화
        </Link>

        <Link
          href="/search"
          className={cn(menuClass, pathname === "/search" && activeMenuClass)}
        >
          검색
        </Link>

        {accessToken ? (
          <Link
            href="/myPage"
            className={cn(menuClass, isProfile && activeMenuClass)}
          >
            내정보
          </Link>
        ) : null}

      </nav>

      <div className="ml-auto flex items-center gap-[10px]">
        {!accessToken ? (
          <Link
            href="/login"
            className={cn(menuClass, pathname === "/login" && activeMenuClass)}
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="hidden h-[42px] w-24 animate-pulse rounded-lg bg-gray-200 sm:block" />
        ) : null}

        <Link
          href="/search"
          aria-label="검색"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] transition-colors hover:bg-[var(--color-bg-page)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)]"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="h-6 w-6"
          />
        </Link>

        {accessToken && !meQuery.isLoading ? (
          <Link
            href="/myPage"
            className="hidden h-[42px] items-center justify-center rounded-lg bg-[var(--color-action-primary)] px-4 text-sm font-extrabold text-white no-underline transition-colors hover:bg-[var(--color-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)] sm:flex"
          >
            {meQuery.data?.nickname ?? "내 정보"}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
