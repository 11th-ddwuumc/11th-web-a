import { authApi } from "../auth-api";

export interface AddRatingRequest {
  movieId: number;
  score: number;
  review: string;
}

export function addRating(body: AddRatingRequest) {
  return authApi.post("ratings", { json: body }).json();
}
