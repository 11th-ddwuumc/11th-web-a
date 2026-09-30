import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
        <p className="text-lg font-semibold text-gray-700">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7]">
      {/* 배경 이미지 영역 */}
      <section className="relative h-[360px] overflow-hidden">
        {/* 배경 이미지 */}
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* 배경 위 어두운 효과 */}
        <div className="absolute inset-0 bg-black/40" />

        {/* 배경 위 내용 */}
        <div className="relative mx-auto flex h-full max-w-[1000px] flex-col justify-end px-6 pb-10 text-white">
          {/* 영화 목록으로 돌아가기 */}
          <Link
            to="/"
            className="absolute left-6 top-6 text-xs text-white/90 hover:text-white"
          >
            ← 영화 목록
          </Link>

          {/* 영화 제목 */}
          <h1 className="text-3xl font-bold">{movie.title}</h1>

          {/* 원제 */}
          <p className="mt-2 text-sm text-white/80">{movie.originalTitle}</p>

          {/* 영화 기본 정보 */}
          <p className="mt-2 text-xs text-white/80">
            {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}분
          </p>
        </div>
      </section>

      {/* 영화 상세 정보 */}
      <section className="mx-auto grid max-w-[1000px] grid-cols-[115px_1fr_190px] gap-5 px-6 py-6">
        {/* 포스터 */}
        <div>
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-full rounded-lg object-cover shadow-md"
          />
        </div>

        {/* 영화 설명 */}
        <div className="border-r border-gray-200 pr-6">
          <h2 className="text-base font-bold text-gray-900">{movie.tagline}</h2>

          <p className="mt-4 text-xs leading-6 text-gray-500">
            {movie.overview}
          </p>

          {/* 즐겨찾기 */}
          <button
            type="button"
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600"
          >
            ♡ 즐겨찾기
          </button>
        </div>

        {/* 내 평점 */}
        <div>
          <h2 className="text-base font-bold text-gray-900">내 평점</h2>

          <p className="mt-1 text-[10px] text-gray-400">
            별점을 눌러 평가해주세요.
          </p>

          {/* 별점 */}
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-400"
              >
                ★
              </button>
            ))}
          </div>

          {/* 한줄평 */}
          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-14 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-[10px] outline-none placeholder:text-gray-400"
          />

          {/* 저장 */}
          <button
            type="button"
            className="mt-2 h-8 w-full rounded-md bg-gray-900 text-xs font-semibold text-white"
          >
            평점 저장
          </button>
        </div>
      </section>
    </main>
  );
}
