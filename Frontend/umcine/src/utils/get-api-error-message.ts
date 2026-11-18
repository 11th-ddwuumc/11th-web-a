import { isHTTPError } from "ky";

interface ErrorResponse {
  message?: string;
}

export async function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (!isHTTPError(error)) return fallbackMessage;

  try {
    const response = await error.response.clone().json<ErrorResponse>();
    return response.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}
