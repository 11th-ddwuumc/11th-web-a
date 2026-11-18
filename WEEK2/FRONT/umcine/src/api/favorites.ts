
import { authApi } from "./auth-api";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface FavoriteStatus {
  movieId: number;
  isFavorite: boolean;
}

export async function getFavorites() {
  const response = await authApi
    .get("favorites")
    .json<ApiResponse<Favorite[]>>();

  return response.result;
}

export async function getFavoriteStatus(movieId: number) {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();

  return response.result;
}

export function addFavorite(movieId: number) {
  return authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
}

export function removeFavorite(movieId: number) {
  return authApi
    .delete(`favorites/${movieId}`)
    .json<ApiResponse<null>>();
}
