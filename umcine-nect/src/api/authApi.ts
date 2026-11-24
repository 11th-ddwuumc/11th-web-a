import { apiRequest } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface MemberResponse {
  memberId: number;
  email: string;
  nickname: string;
  createdAt: string;
}

export function login(data: LoginRequest) {
  return apiRequest<LoginResponse>(
    "/auth/login",
    "POST",
    data,
    false,
  );
}

export function signup(data: SignupRequest) {
  return apiRequest<MemberResponse>(
    "/auth/signup",
    "POST",
    data,
    false,
  );
}

export function getMe() {
  return apiRequest<MemberResponse>("/members/me");
}

export function updateNickname(nickname: string) {
  return apiRequest<MemberResponse>(
    "/members/me",
    "PATCH",
    { nickname },
  );
}
