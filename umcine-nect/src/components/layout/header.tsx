"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

export function Header() {
  const pathname = usePathname();
  const navigate = useRouter();
  const queryClient = useQueryClient();

  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const isMoviePage =
    pathname === "/" || pathname.startsWith("/movies/");
  const isSearchPage = pathname === "/search";
  const isProfilePage = pathname === "/profile";

  const menuClass = (active: boolean) =>
    cn(
      "text-sm font-semibold text-gray-500 hover:text-[#191b1f]",
      active && "text-[#191b1f] underline underline-offset-4",
    );

  function handleLogout() {
    setAccessToken(null);
    queryClient.clear();
    navigate.push("/");
  }

  return (
    <header className="bg-white">
      <div className="mx-auto flex min-h-[88px] max-w-[1360px] flex-wrap items-center gap-x-5 gap-y-4 px-5 py-4 sm:gap-x-10 sm:px-10">
        <Link
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight"
          href="/"
        >
          <span className="grid size-8 place-items-center rounded-[7px] border-2 border-[#191b1f]">
            <img className="size-6" src="/icons/movie.svg" alt="" />
          </span>
          UMCine
        </Link>

        <nav
          className="order-3 flex w-full items-center gap-5 sm:order-none sm:w-auto sm:gap-[30px]"
          aria-label="주 메뉴"
        >
          <Link
            className={menuClass(isMoviePage)}
            href="/"
            aria-current={isMoviePage ? "page" : undefined}
          >
            영화
          </Link>

          <Link
            className={menuClass(isSearchPage)}
            href="/search"
            aria-current={isSearchPage ? "page" : undefined}
          >
            검색
          </Link>

          {accessToken && (
            <Link
              className={menuClass(isProfilePage)}
              href="/profile"
              aria-current={isProfilePage ? "page" : undefined}
            >
              내 정보
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            className="grid size-[42px] place-items-center rounded-lg border border-gray-200"
            href="/search"
            aria-label="영화 검색"
          >
            <img className="size-[22px]" src="/icons/search.svg" alt="" />
          </Link>

          {accessToken ? (
            <button
              type="button"
              onClick={handleLogout}
              className="h-[42px] rounded-lg bg-gray-800 px-4 text-sm font-bold text-white"
            >
              로그아웃
            </button>
          ) : (
            <Link
              href="/login"
              className="flex h-[42px] items-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}