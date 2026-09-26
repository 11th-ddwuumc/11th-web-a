import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a href="#" className="header-logo">
          <img src="/icons/movie-icons/movie.svg" alt="UMCine 로고" />
          <span>UMCine</span>
        </a>

        <nav className="header-menu">
          <a href="#">영화</a>
          <a href="#">검색</a>
          <a href="#">내정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button className="search-button">
          <img src="/icons/movie-icons/search.svg" alt="검색" />
        </button>

        <button className="login-button">로그인</button>
      </div>
    </header>
  );
}

export default Header;
