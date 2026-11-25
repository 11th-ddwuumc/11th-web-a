import { authApi } from "../auth-api";

export interface FavoriteMovie {
  movieId: number;
  title: string;
  posterPath: string | null;
}

interface GetFavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteMovie[];
}

export function getFavorites() {
  return authApi.get("favorites").json<GetFavoritesResponse>();
}
