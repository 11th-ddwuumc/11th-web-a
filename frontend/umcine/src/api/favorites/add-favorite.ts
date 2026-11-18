import { authApi } from "../auth-api";

export interface AddFavoriteRequest {
  movieId: number;
}

interface FavoriteMutationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
}

export function addFavorite(body: AddFavoriteRequest) {
  return authApi
    .post("favorites", { json: body })
    .json<FavoriteMutationResponse>();
}
