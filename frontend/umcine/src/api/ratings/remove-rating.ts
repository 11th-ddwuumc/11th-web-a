import { authApi } from "../auth-api";

export function removeRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json();
}
