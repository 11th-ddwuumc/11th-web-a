"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import {
  getFavorites,
  type FavoriteMovie,
} from "../../api/favorites/get-favorites";

export function MyPage() {
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });
  const me = meQuery.data;

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 5 * 60 * 1000,
  });

  let favorites: FavoriteMovie[] = [];
  if (favoritesQuery.data) {
    favorites = favoritesQuery.data.result;
  }

  if (meQuery.isLoading) {
    return (
      <p className="p-8 text-sm text-gray-500">내 정보를 불러오는 중이에요.</p>
    );
  }

  if (!me) {
    return (
      <p className="p-8 text-sm text-gray-500">내 정보를 불러오지 못했어요.</p>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-[#f5f5f7]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">내 정보</h1>
          <Link
            href="/my-edit"
            className="rounded-lg bg-[#5B5CEB] px-4 py-2 text-sm font-semibold text-white"
          >
            정보 수정
          </Link>
        </div>

        <h2 className="mt-6 text-sm font-bold text-gray-900">기본 정보</h2>
        <div className="mt-4 flex items-center gap-6 border-b border-gray-200 pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-200">
            <img
              src="/icons/movie-icons/person.svg"
              alt=""
              className="h-6 w-6"
            />
          </div>

          <div className="w-80">
            <p className="text-[11px] text-gray-400">닉네임</p>
            <p className="mt-1 text-sm font-bold text-gray-900">
              {me.nickname}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-gray-400">이메일</p>
            <p className="mt-1 text-sm font-bold text-gray-900">{me.email}</p>
          </div>
        </div>

        <h2 className="mt-6 text-sm font-bold text-gray-900">내 즐겨찾기</h2>
        {favorites.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">
            즐겨찾기한 영화가 없어요.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-5 gap-4">
            {favorites.map((movie) => (
              <div key={movie.movieId}>
                <div className="aspect-[2/3] w-full rounded-lg bg-gray-300" />
                <p className="mt-2 text-xs font-bold text-gray-900">
                  {movie.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
