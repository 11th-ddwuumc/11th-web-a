"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "../../api/authApi";
import { useAuthStore } from "../../stores/auth-store";
import "./auth.css";

export function LoginPage() {
  const navigate = useRouter();
  const queryClient = useQueryClient();

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      queryClient.clear();
      setAccessToken(data.accessToken);

      navigate.push("/profile");
    },
  });

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    isEmailValid && password.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid || loginMutation.isPending) {
      return;
    }

    loginMutation.mutate({
      email,
      password,
    });
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">
          로그인
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="login-email"
            >
              이메일
            </label>

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={loginMutation.isPending}
                required
              />
            </div>

            {email.length > 0 && !isEmailValid && (
              <p className="auth-error">
                올바른 이메일을 입력해주세요.
              </p>
            )}
          </div>

          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="login-password"
            >
              비밀번호
            </label>

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                id="login-password"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                disabled={loginMutation.isPending}
                required
              />
            </div>
          </div>

          {loginMutation.isError && (
            <p className="auth-error" role="alert">
              {loginMutation.error.message}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={
              !isFormValid ||
              loginMutation.isPending
            }
          >
            {loginMutation.isPending
              ? "로그인 중..."
              : "로그인"}
          </button>
        </form>

        <p className="auth-footer">
          처음이신가요?{" "}
          <Link href="/signup">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
