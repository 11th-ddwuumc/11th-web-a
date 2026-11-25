"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    setErrorMessage("");
    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onError: async (error) => {
          setErrorMessage(
            await getApiErrorMessage(
              error,
              "로그인에 실패했어요. 다시 시도해 주세요.",
            ),
          );
        },
      },
    );
  }

  return (
    <main className="grid min-h-[calc(100vh-91px)] place-items-center bg-[var(--color-bg-page)] px-4 py-12">
      <section className="w-full max-w-[480px] rounded-3xl border border-[var(--color-border-default)] bg-white p-6 shadow-[0_20px_50px_rgba(17,19,24,0.08)] sm:p-10">
        <p className="text-sm font-bold text-[var(--color-action-primary)]">WELCOME BACK</p>
        <h1 className="mt-2 text-[32px] font-bold tracking-[-1.6px]">로그인</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          UMCine에서 좋아하는 영화를 계속 만나보세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-bold">
            이메일
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력해 주세요"
              className="mt-2 h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-white px-4 font-normal outline-none transition focus:border-[var(--color-action-primary)] focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block text-sm font-bold">
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요"
              className="mt-2 h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-white px-4 font-normal outline-none transition focus:border-[var(--color-action-primary)] focus:ring-2 focus:ring-blue-100"
            />
          </label>

          {errorMessage ? (
            <p role="alert" className="text-sm text-[var(--color-danger-default)]">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="h-12 w-full cursor-pointer rounded-xl bg-[var(--color-action-primary)] text-sm font-bold text-white transition hover:bg-[var(--color-action-hover)] disabled:cursor-not-allowed disabled:bg-[var(--color-action-disabled)]"
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          아직 계정이 없나요?{" "}
          <Link href="/signup" className="font-bold text-[var(--color-action-primary)]">
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
