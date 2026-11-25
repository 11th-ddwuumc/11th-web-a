"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password: password,
    });
  };

  return (
    <div className="flex w-full flex-1 items-center justify-center bg-[#f5f5f7] px-6 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-[420px] text-left">
        <h1 className="mb-6 text-2xl font-extrabold text-gray-900">로그인</h1>

        <label className="text-sm font-semibold text-gray-900">이메일</label>
        <div className="relative mt-1">
          <img
            src="/icons/movie-icons/mail.svg"
            alt=""
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none"
          />
        </div>

        <label className="mt-4 block text-sm font-semibold text-gray-900">
          비밀번호
        </label>
        <div className="relative mt-1">
          <img
            src="/icons/movie-icons/lock.svg"
            alt=""
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="mt-6 w-full rounded-lg bg-[#5B5CEB] py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          아직 계정이 없나요?{" "}
          <Link href="/signup" className="font-semibold text-[#5B5CEB]">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}
