import { apiClient } from "../api-client";
import type { ApiResponse } from "../models";

interface AvailabilityResponse {
  available?: boolean;
  isAvailable?: boolean;
  duplicated?: boolean;
}

export interface SignUpRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface SignUpResult {
  memberId: number;
  email: string;
  nickname: string;
}

function readAvailability(response: AvailabilityResponse) {
  if (typeof response.available === "boolean") return response.available;
  if (typeof response.isAvailable === "boolean") return response.isAvailable;
  if (typeof response.duplicated === "boolean") return !response.duplicated;
  return true;
}

export async function checkEmailAvailability(email: string) {
  const response = await apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();

  return readAvailability(response);
}

export async function checkNicknameAvailability(nickname: string) {
  const response = await apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();

  return readAvailability(response);
}

export function signUp(body: SignUpRequest) {
  return apiClient
    .post("members", { json: body })
    .json<ApiResponse<SignUpResult>>();
}
