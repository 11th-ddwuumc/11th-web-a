import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  review: string;
}

interface GetRatingsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating[];
}

export function getRatings(memberId: number) {
  return authApi.get(`members/${memberId}/ratings`).json<GetRatingsResponse>();
}
