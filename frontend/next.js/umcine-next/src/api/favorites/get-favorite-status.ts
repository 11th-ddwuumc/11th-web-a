import { authApi } from "../auth-api";

interface GetFavoriteStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    isFavorite: boolean;
  };
}

export function getFavoriteStatus(movieId: number) {
  return authApi.get(`favorites/${movieId}`).json<GetFavoriteStatusResponse>();
}
