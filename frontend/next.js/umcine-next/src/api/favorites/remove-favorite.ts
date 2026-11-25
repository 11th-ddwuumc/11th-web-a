import { authApi } from "../auth-api";

interface FavoriteMutationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
}

export function removeFavorite(movieId: number) {
  return authApi
    .delete(`favorites/${movieId}`)
    .json<FavoriteMutationResponse>();
}
