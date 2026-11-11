
import ky from "ky";

const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("TMDB API 토큰이 설정되지 않았습니다.");
}

export const tmdbClient = ky.create({
  prefix: import.meta.env.VITE_TMDB_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
  },
  timeout: 10000,
});
