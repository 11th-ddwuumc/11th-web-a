
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { getMe } from "../../api/members/me";
import { getFavorites } from "../../api/favorites";

import "./auth-pages.css";

export function MyPage() {
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    retry: false,
  });

  const member = meQuery.data;
  const favoriteMovies = favoritesQuery.data ?? [];

  return (
    <main className="mypage">
      <div className="mypage-inner">
        <header className="mypage-heading">
          <h1>내 정보</h1>

          <Link to="/my/edit" className="mypage-primary">
            정보 수정
          </Link>
        </header>

        {/* 기본 정보 */}
        <section className="mypage-section">
          <h2>기본 정보</h2>

          {meQuery.isLoading ? (
            <p>회원 정보를 불러오는 중...</p>
          ) : meQuery.isError ? (
            <p>회원 정보를 불러오지 못했어요.</p>
          ) : (
            <div className="profile-info">
              <div className="profile-avatar">
                <svg viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="22" r="10" fill="currentColor" />
                  <path
                    d="M12 53c0-12 9-19 20-19s20 7 20 19"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="profile-detail">
                <span>닉네임</span>
                <strong>{member?.nickname}</strong>
              </div>

              <div className="profile-detail">
                <span>이메일</span>
                <strong>{member?.email}</strong>
              </div>
            </div>
          )}
        </section>

        {/* 즐겨찾기 목록 */}
        <section className="mypage-section favorites-section">
          <h2>내 즐겨찾기</h2>

          {favoritesQuery.isLoading ? (
            <p>즐겨찾기를 불러오는 중...</p>
          ) : favoritesQuery.isError ? (
            <p>즐겨찾기 목록을 불러오지 못했어요.</p>
          ) : favoriteMovies.length === 0 ? (
            <p>아직 즐겨찾기한 영화가 없어요.</p>
          ) : (
            <div className="favorite-grid">
              {favoriteMovies.map((favorite) => (
                <article
                  className="favorite-movie"
                  key={favorite.favoriteId}
                >
                  <Link
                    to="/movies/$movieId"
                    params={{
                      movieId: String(favorite.movieId),
                    }}
                  >
                    <div className="favorite-poster poster-dark">
                      <span>영화 #{favorite.movieId}</span>
                    </div>

                    <h3>영화 #{favorite.movieId}</h3>
                  </Link>

                  <p>
                    등록일:{" "}
                    {new Date(
                      favorite.createdAt
                    ).toLocaleDateString("ko-KR")}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div className="favorite-pagination">
            <button
              type="button"
              disabled
              aria-label="이전 페이지"
            >
              ‹
            </button>

            <span className="current-page">1</span>

            <button
              type="button"
              disabled
              aria-label="다음 페이지"
            >
              ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
