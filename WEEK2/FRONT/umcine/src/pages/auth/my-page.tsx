
import { Link } from "@tanstack/react-router";
import "./auth-pages.css";

const member = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

const favoriteMovies = [
  {
    id: 1,
    title: "스파이더맨: 브랜드 뉴 데이",
    date: "2026.07.29",
    poster: "",
    color: "poster-red",
  },
  {
    id: 2,
    title: "오디세이",
    date: "2026.08.05",
    poster: "",
    color: "poster-dark",
  },
  {
    id: 3,
    title: "미니언즈 & 몬스터즈",
    date: "2026.07.15",
    poster: "",
    color: "poster-yellow",
  },
];

export function MyPage() {
  return (
    <main className="mypage">
      <div className="mypage-inner">
        <header className="mypage-heading">
          <h1>내 정보</h1>
          <Link to="/my/edit" className="mypage-primary">
            정보 수정
          </Link>
        </header>

        <section className="mypage-section">
          <h2>기본 정보</h2>

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
              <strong>{member.nickname}</strong>
            </div>

            <div className="profile-detail">
              <span>이메일</span>
              <strong>{member.email}</strong>
            </div>
          </div>
        </section>

        <section className="mypage-section favorites-section">
          <h2>내 즐겨찾기</h2>

          <div className="favorite-grid">
            {favoriteMovies.map((movie) => (
              <article className="favorite-movie" key={movie.id}>
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={`${movie.title} 포스터`}
                    className="favorite-poster"
                  />
                ) : (
                  <div className={`favorite-poster ${movie.color}`}>
                    <span>{movie.title}</span>
                  </div>
                )}

                <h3>{movie.title}</h3>
                <p>{movie.date}</p>
              </article>
            ))}
          </div>

          <div className="favorite-pagination">
            <button type="button" disabled aria-label="이전 페이지">
              ‹
            </button>
            <span className="current-page">1</span>
            <button type="button" disabled aria-label="다음 페이지">
              ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
