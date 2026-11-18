import { apiRequest } from "./client";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

export function getMyFavorites() {
  return apiRequest<Favorite[]>("/favorites");
}

export function getFavoriteStatus(movieId: number) {
  return apiRequest<FavoriteStatus>(
    `/favorites/${movieId}`,
  );
}

export function addFavorite(movieId: number) {
  return apiRequest<Favorite>(
    "/favorites",
    "POST",
    { movieId },
  );
}

export function removeFavorite(movieId: number) {
  return apiRequest<void>(
    `/favorites/${movieId}`,
    "DELETE",
  );
}