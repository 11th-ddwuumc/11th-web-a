export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo" href="/">
          <span className="logo-icon">
            <img src="/icons/movie.svg" alt="" />
          </span>
          UMCine
        </a>

        <nav className="header-nav" aria-label="주 메뉴">
          <a className="header-menu active" href="/">
            영화
          </a>
          <span className="header-menu">검색</span>
          <span className="header-menu">내 정보</span>
        </nav>

        <div className="header-actions">
          <button
            className="search-button"
            type="button"
            aria-label="검색"
          >
            <img src="/icons/search.svg" alt="" />
          </button>

          <button className="login-button" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}