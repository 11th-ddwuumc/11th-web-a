
const BASE_URL = "http://192.168.0.14:8080";

export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type Favorite = {
  favoriteId: number;
  movieId: number;
  createdAt: string;
};

export type FavoriteStatus = {
  isFavorite: boolean;
};

export type MovieRecordRequest = {
  movieId: number;
  score: number;
  comment: string;
  addToFavorites: boolean;
};

export type MovieRecordResponse = {
  rating: {
    ratingId: number;
    movieId: number;
    score: number;
    comment: string | null;
  };
  favorite: Favorite | null;
};

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

async function request<T>(
  path: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    },
    ...(body !== undefined
      ? { body: JSON.stringify(body) }
      : {}),
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || `요청 실패: ${response.status}`);
  }

  return data.result;
}

export function getMyFavorites() {
  return request<Favorite[]>("/favorites");
}

export function getFavoriteStatus(movieId: number) {
  return request<FavoriteStatus>(`/favorites/${movieId}`);
}

export function addFavorite(movieId: number) {
  return request<Favorite>("/favorites", "POST", { movieId });
}

export function removeFavorite(movieId: number) {
  return request<null>(`/favorites/${movieId}`, "DELETE");
}

export function createMovieRecord(data: MovieRecordRequest) {
  return request<MovieRecordResponse>(
    "/movie-records",
    "POST",
    data
  );
}
