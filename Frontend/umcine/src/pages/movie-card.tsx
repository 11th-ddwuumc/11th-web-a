import type { Movie } from "../types/movie";
import bookmarkIcon from "../assets/movie-icons/bookmark.svg"
import bookmarkOutlineIcon from "../assets/movie-icons/bookmark-outline.svg"
import { useState } from "react";

const posterImages = import.meta.glob(
  "../assets/images/movies/*.jpg",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
) as Record<string, string>;

interface MovieCardProps{
    movie: Movie;
}

export default function MovieCard({movie} : MovieCardProps ) {
    const fileName = movie.posterPath.split("/").pop();
    
    const [isBookMarked, setIsBookMarked] = useState(
        movie.isBookmarked,
    );

    const posterSrc =
        posterImages[`../assets/images/movies/${fileName}`];

   return (
      <article
        style= {{
            display: "flex",
            flexDirection: "column",
            gap: "0px 18p 20px 0px",
        }}>
            <div style={{
                position: "relative",
                width: "100%",
            }}>
                <img
                src={posterSrc}
                alt={`${movie.title} 포스터`}
                style={{
                    display: "block",
                    width:"100%",
                    aspectRatio: "2/3",
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginBottom: "9px"
                }}
            />

            <button
                type="button"
                aria-label={
                    isBookMarked
                    ?"북마크에서 삭제"
                    :"북마크에서 추가"
                }
                onClick={()=> setIsBookMarked(!isBookMarked)}
                style={{
                      position: "absolute",
                      top: "10px",
                      right: "9.799px",
                    display: "flex",
                    width: "34px",
                    height: "34px",
                    padding: "7.5px 6px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: " var(--corner-radius-8, 8px)",
                    border: "var(--stroke-weight-1, 1px) solid var(--color-bg-surface)",
                    background: " var(--color-text-primary)",
                    cursor: "pointer",
                }}>
                     <img
                        src={
                        isBookMarked
                            ? bookmarkIcon
                            : bookmarkOutlineIcon
                        }
                        alt=""
                        style={{
                        width: "24px",
                        height: "24px",
                        }}
                    />
                </button>
            </div>
            
            
            <div
                style={{
                color: "var(--color-text-primary)",
                fontFamily: "Pretendard",
                fontSize: "14px",
                fontWeight: 800,
                }}
            >
                {movie.title}
            </div>

            <div
                style={{
                color: "var(--color-text-tertiary)",
                fontFamily: "Pretendard",
                fontSize: "12px",
                fontWeight: 400,
                }}
            >
                {movie.releaseDate}
            </div>
    </article>
  );
}