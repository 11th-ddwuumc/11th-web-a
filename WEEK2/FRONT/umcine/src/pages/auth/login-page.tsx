
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import "./auth-pages.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  const canSubmit =
    EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="auth-page">
      <section className="auth-container">
        <h1>로그인</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="auth-footer">
          아직 계정이 없나요?{" "}
          <Link to="/signup">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
