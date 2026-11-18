import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

import {
  checkEmail,
  checkNickname,
} from "../../api/memberApi";
import { signup } from "../../api/authApi";
import "./auth.css";

export function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] =
    useState("");

  const [isEmailAvailable, setIsEmailAvailable] =
    useState<boolean | null>(null);

  const [isNicknameAvailable, setIsNicknameAvailable] =
    useState<boolean | null>(null);

  const [isCheckingEmail, setIsCheckingEmail] =
    useState(false);

  const [isCheckingNickname, setIsCheckingNickname] =
    useState(false);

  const [emailCheckError, setEmailCheckError] =
    useState("");

  const [nicknameCheckError, setNicknameCheckError] =
    useState("");

  const emailInputRef = useRef(email);
  const nicknameInputRef = useRef(nickname);

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async () => {
      alert("회원가입이 완료되었습니다!");

      await navigate({ to: "/login" });
    },
  });

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isNicknameValid =
    nickname.length >= 2 && nickname.length <= 12;

  const isPasswordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/.test(
      password,
    );

  const isPasswordConfirmValid =
    passwordConfirm.length > 0 &&
    password === passwordConfirm;

  const isSubmitting = signupMutation.isPending;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid &&
    isEmailAvailable === true &&
    isNicknameAvailable === true &&
    !isCheckingEmail &&
    !isCheckingNickname &&
    !isSubmitting;

  function handleEmailChange(value: string) {
    emailInputRef.current = value;
    setEmail(value);
    setIsEmailAvailable(null);
    setEmailCheckError("");
  }

  function handleNicknameChange(value: string) {
    nicknameInputRef.current = value;
    setNickname(value);
    setIsNicknameAvailable(null);
    setNicknameCheckError("");
  }

  async function handleCheckEmail() {
    if (
      !isEmailValid ||
      isCheckingEmail ||
      isSubmitting
    ) {
      return;
    }

    const checkedEmail = email;

    setIsCheckingEmail(true);
    setIsEmailAvailable(null);
    setEmailCheckError("");

    try {
      const result = await checkEmail(checkedEmail);

      if (emailInputRef.current === checkedEmail) {
        setIsEmailAvailable(result.available);
      }
    } catch (error) {
      if (emailInputRef.current === checkedEmail) {
        setEmailCheckError(
          error instanceof Error
            ? error.message
            : "이메일 중복 확인에 실패했습니다.",
        );
      }
    } finally {
      setIsCheckingEmail(false);
    }
  }

  async function handleCheckNickname() {
    if (
      !isNicknameValid ||
      isCheckingNickname ||
      isSubmitting
    ) {
      return;
    }

    const checkedNickname = nickname;

    setIsCheckingNickname(true);
    setIsNicknameAvailable(null);
    setNicknameCheckError("");

    try {
      const result = await checkNickname(checkedNickname);

      if (nicknameInputRef.current === checkedNickname) {
        setIsNicknameAvailable(result.available);
      }
    } catch (error) {
      if (nicknameInputRef.current === checkedNickname) {
        setNicknameCheckError(
          error instanceof Error
            ? error.message
            : "닉네임 중복 확인에 실패했습니다.",
        );
      }
    } finally {
      setIsCheckingNickname(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    signupMutation.mutate({
      email,
      nickname,
      password,
    });
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">
          회원가입
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="signup-email"
            >
              이메일
            </label>

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) =>
                  handleEmailChange(event.target.value)
                }
                disabled={isSubmitting}
                required
              />

              <button
                className="auth-check-btn"
                type="button"
                onClick={() => void handleCheckEmail()}
                disabled={
                  !isEmailValid ||
                  isCheckingEmail ||
                  isSubmitting
                }
              >
                {isCheckingEmail
                  ? "확인 중..."
                  : "중복 확인"}
              </button>
            </div>

            {email.length > 0 && !isEmailValid && (
              <p className="auth-error">
                올바른 이메일을 입력해주세요.
              </p>
            )}

            {isEmailAvailable === true && (
              <p className="auth-success">
                사용 가능한 이메일입니다.
              </p>
            )}

            {isEmailAvailable === false && (
              <p className="auth-error">
                이미 사용 중인 이메일입니다.
              </p>
            )}

            {emailCheckError && (
              <p className="auth-error">
                {emailCheckError}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="signup-nickname"
            >
              닉네임
            </label>

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                id="signup-nickname"
                type="text"
                placeholder="2~12자"
                value={nickname}
                onChange={(event) =>
                  handleNicknameChange(event.target.value)
                }
                disabled={isSubmitting}
                required
              />

              <button
                className="auth-check-btn"
                type="button"
                onClick={() =>
                  void handleCheckNickname()
                }
                disabled={
                  !isNicknameValid ||
                  isCheckingNickname ||
                  isSubmitting
                }
              >
                {isCheckingNickname
                  ? "확인 중..."
                  : "중복 확인"}
              </button>
            </div>

            {nickname.length > 0 && !isNicknameValid && (
              <p className="auth-error">
                닉네임은 2~12자로 입력해주세요.
              </p>
            )}

            {isNicknameAvailable === true && (
              <p className="auth-success">
                사용 가능한 닉네임입니다.
              </p>
            )}

            {isNicknameAvailable === false && (
              <p className="auth-error">
                이미 사용 중인 닉네임입니다.
              </p>
            )}

            {nicknameCheckError && (
              <p className="auth-error">
                {nicknameCheckError}
              </p>
            )}
          </div>

          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="signup-password"
            >
              비밀번호
            </label>

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                id="signup-password"
                type="password"
                placeholder="8자 이상"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <p className="auth-hint">
              영문 대·소문자, 숫자, 특수문자를 모두
              포함해 8자 이상 입력해 주세요.
            </p>

            {password.length > 0 && !isPasswordValid && (
              <p className="auth-error">
                비밀번호 조건을 확인해주세요.
              </p>
            )}
          </div>

          <div className="auth-field">
            <label
              className="auth-label"
              htmlFor="signup-password-confirm"
            >
              비밀번호 확인
            </label>

            <div className="auth-input-wrap">
              <input
                className="auth-input"
                id="signup-password-confirm"
                type="password"
                placeholder="다시 입력"
                value={passwordConfirm}
                onChange={(event) =>
                  setPasswordConfirm(event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            {passwordConfirm.length > 0 &&
              !isPasswordConfirmValid && (
                <p className="auth-error">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
          </div>

          {signupMutation.isError && (
            <p className="auth-error" role="alert">
              {signupMutation.error.message}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={!isFormValid}
          >
            {isSubmitting
              ? "가입 중..."
              : "가입하기"}
          </button>
        </form>

        <p className="auth-footer">
          이미 계정이 있나요?{" "}
          <Link to="/login">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}