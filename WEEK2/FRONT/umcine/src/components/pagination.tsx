import "./pagination.css";

function Pagination() {
  return (
    <div className="pagination">
      <button className="pagination-button">
        <img src="public\images\logos\tmdb-logo.svg" alt="" />
        <span>
          This product uses the TMDB API put is not endorsed or certified by
          TMDB
        </span>
      </button>
    </div>
  );
}

export default Pagination;
