export interface MovieCardItem {
  id: number;
  title: string;
  releaseDate: string;
  posterPath: string;
}

export interface Movie extends MovieCardItem {
  originalTitle: string;
  backdropPath: string;
  genres: string[];
  runtime: string;
  tagline: string;
  overview: string;
  isBookmarked: boolean;
}
