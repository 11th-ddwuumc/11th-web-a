import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });


  const movie = movies.find((item) => item.id === Number(movieId));


  const [isBookmarked, setIsBookmarked] = useState(false);


  useEffect(() => {
    if (movie) {
      setIsBookmarked(movie.isBookmarked);
    } else {
      setIsBookmarked(false);
    }
  }, [movie]);


  if (!movie) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#f5f5f7]">
        <p className="text-lg font-semibold text-gray-700">
          영화를 찾을 수 없어요.
        </p>
      </div>
    );
  }


  let bookmarkIcon = "/icons/movie-icons/bookmark-outline.svg";
  if (isBookmarked) {
    bookmarkIcon = "/icons/movie-icons/bookmark.svg";
  }


  function handleToggleBookmark() {
    setIsBookmarked(!isBookmarked);
  }

  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto bg-[#f5f5f7]">
      <section className="relative h-[300px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-5xl px-6 pb-8">
          <Link
            to="/"
            className="mb-6 inline-flex text-sm font-medium text-white/80 hover:text-white"
          >
            ← 영화 목록
          </Link>

          <div className="text-left text-white">
            <h1 className="text-4xl font-extrabold">{movie.title}</h1>
            <p className="mt-2 text-base text-white/90">{movie.originalTitle}</p>
            <p className="mt-2 text-sm text-white/80">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-6 md:grid-cols-[160px_1fr_240px]">

        <img
          src={movie.posterPath}
          alt={movie.title + " 포스터"}
          className="w-40 rounded-lg object-cover shadow-lg"
        />


        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-900">{movie.tagline}</h2>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {movie.overview}
          </p>

          <button
            type="button"
            onClick={handleToggleBookmark}
            className={cn(
              "mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white",
              isBookmarked ? "bg-[#5b5ce9]" : "bg-gray-900",
            )}
          >
            <img
              src={bookmarkIcon}
              alt=""
              className="h-[18px] w-[18px] brightness-0 invert"
            />
            <span>즐겨찾기</span>
          </button>
        </div>

      
        <aside className="border-t border-gray-200 pt-5 text-left md:border-l md:border-t-0 md:pl-6">
          <h3 className="font-bold text-gray-900">내 평점</h3>
          <p className="mt-1 text-xs text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="mt-3 flex gap-1">
            <span className="text-xl text-gray-300">★</span>
            <span className="text-xl text-gray-300">★</span>
            <span className="text-xl text-gray-300">★</span>
            <span className="text-xl text-gray-300">★</span>
            <span className="text-xl text-gray-300">★</span>
          </div>

          <textarea
            aria-label="후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-4 h-24 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none"
          />

          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </div>
  );
}
