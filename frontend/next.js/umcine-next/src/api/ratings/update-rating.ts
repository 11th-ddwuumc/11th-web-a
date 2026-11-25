import { authApi } from "../auth-api";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  review: string;
}

export function updateRating(body: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${body.ratingId}`, {
      json: { score: body.score, review: body.review },
    })
    .json();
}
