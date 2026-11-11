import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canLogin = email.trim().length > 0 && password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center bg-[#f5f5f7] px-6 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 text-left shadow"
      >
        <h1 className="mb-6 text-2xl font-extrabold text-gray-900">로그인</h1>

        <label className="text-sm font-semibold text-gray-900">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        />

        <label className="mt-4 block text-sm font-semibold text-gray-900">
          비밀번호
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        />

        <button
          type="submit"
          disabled={!canLogin}
          className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
        >
          로그인
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          아직 계정이 없나요?{" "}
          <Link to="/signup" className="font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}
