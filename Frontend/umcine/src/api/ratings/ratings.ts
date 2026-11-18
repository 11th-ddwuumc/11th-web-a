import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

export function getMemberRatings(memberId: number) {
  return authApi.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export function createRating(body: CreateRatingRequest) {
  return authApi
    .post("ratings", { json: body })
    .json<ApiResponse<Rating>>();
}

export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<Rating>>();
}

export function deleteRating(ratingId: number) {
  return authApi
    .delete(`ratings/${ratingId}`)
    .json<ApiResponse<null>>();
}
