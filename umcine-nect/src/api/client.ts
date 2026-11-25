import { useAuthStore } from "../stores/auth-store";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

export async function apiRequest<T>(
  path: string,
  method: Method = "GET",
  body?: unknown,
  authenticated = true,
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(authenticated && token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    },
    ...(body !== undefined
      ? { body: JSON.stringify(body) }
      : {}),
  });

  if (!response.ok) {
    let message = `요청 실패 (${response.status})`;

    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch {
      // 응답 본문이 없거나 JSON이 아닌 경우
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
