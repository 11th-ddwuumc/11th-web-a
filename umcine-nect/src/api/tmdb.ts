import ky from "ky";

export const tmdbClient = ky.create({
  prefixUrl: "/api/tmdb",
  timeout: 10000,
});
