
import { authApi } from "./auth-api";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
}

export interface RatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export async function getMemberRatings(memberId: number) {
  const response = await authApi
    .get(`members/${memberId}/ratings`)
    .json<ApiResponse<Rating[]>>();

  return response.result;
}

export function createRating(body: RatingRequest) {
  return authApi
    .post("ratings", { json: body })
    .json<ApiResponse<Rating>>();
}

export function updateRating(
  ratingId: number,
  body: Pick<RatingRequest, "score" | "comment">,
) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<Rating>>();
}

export function deleteRating(ratingId: number) {
  return authApi
    .delete(`ratings/${ratingId}`)
    .json<ApiResponse<null>>();
}
