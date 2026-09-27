import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-box">
          <img src="icons/movie-icons/movie.svg" alt="UMCine" className="logo" />
          <span>UMCine</span>
        </div>

        <nav className="menu">
          <a href="#">영화</a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button className="search-btn">
          <img src="/icons/movie-icons/search.svg" alt="검색" />
        </button>

        <button className="login-btn">로그인</button>
      </div>
    </header>
  );
}