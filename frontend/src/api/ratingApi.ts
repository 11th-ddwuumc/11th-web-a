import { apiRequest } from "./client";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}

export interface RatingRequest {
  score: number;
  comment: string;
}

export function getMyRatings() {
  return apiRequest<Rating[]>("/ratings/me");
}

export function getMemberRatings(memberId: number) {
  return apiRequest<Rating[]>(
    `/members/${memberId}/ratings`,
  );
}

export function createRating(
  data: RatingRequest & { movieId: number },
) {
  return apiRequest<Rating>(
    "/ratings",
    "POST",
    data,
  );
}

export function updateRating(
  ratingId: number,
  data: RatingRequest,
) {
  return apiRequest<Rating>(
    `/ratings/${ratingId}`,
    "PATCH",
    data,
  );
}

export function deleteRating(ratingId: number) {
  return apiRequest<void>(
    `/ratings/${ratingId}`,
    "DELETE",
  );
}
