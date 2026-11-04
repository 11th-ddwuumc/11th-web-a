import type { Movie } from "../types/movie";
import "./movie-card.css";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="relative text-left">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <img
          className="block w-full aspect-[3/3.5] object-cover rounded-[10px]"
          src={movie.posterPath}
          alt={`${movie.title}포스터`}
        />
      </Link>

      <div className="absolute top-[10px] right-[10px] z-10">
        <BookmarkButton movieId={movie.id} />
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="!text-[20px] font-bold">{movie.title}</h2>
      </Link>
      <p>{movie.releaseDate}</p>
    </div>
  );
}

export default MovieCard;
