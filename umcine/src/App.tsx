import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/Pagination";

import { movies } from "./data/movies";

function App(){

  const [movieList,setMovieList]=useState(movies);

  const toggleBookmark=(id:number)=>{

    setMovieList((prev)=>
      prev.map((movie)=>
        movie.id===id
          ?{
              ...movie,
              isBookmarked:!movie.isBookmarked,
            }
          :movie
      )
    );

  };

  return (
  <div className="app">
    <Header />

    <main>
      <h2>영화 목록</h2>

      <MovieGrid
        movies={movieList}
        onToggleBookmark={toggleBookmark}
      />

      <Pagination />
    </main>


    <footer className="footer">
      <div className="footer-content">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="tmdb-logo"
        />

        <p className="footer-text">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  </div>
); }

export default App;