
import { useState } from "react";
import type { FormEvent } from "react";
import "./auth-pages.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("로그인 API는 8주차에서 연결합니다.");
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

          <button type="submit" disabled={!email || !password}>
            로그인
          </button>
        </form>

        <p className="auth-footer">
          아직 계정이 없나요? <a href="/signup">회원가입</a>
        </p>
      </section>
    </main>
  );
}
