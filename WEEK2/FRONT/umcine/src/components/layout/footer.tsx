
import "./footer.css";

export function Footer() {
  return (
    <footer className="pagination">
      <div className="pagination-button">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />
        <span>
          This product uses the TMDB API but is not endorsed
          or certified by TMDB.
        </span>
      </div>
    </footer>
  );
}
