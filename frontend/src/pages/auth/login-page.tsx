import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import "./auth.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("로그인 API는 8주차에 연결할 예정입니다.");
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">로그인</h1>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">
              이메일
            </label>

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                id="login-email"
                type="email"
                placeholder="✉  name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">
              비밀번호
            </label>

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                id="login-password"
                type="password"
                placeholder="♙  비밀번호"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={!isFormValid}
          >
            로그인
          </button>
        </form>

        <p className="auth-footer">
          처음이신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </main>
  );
}