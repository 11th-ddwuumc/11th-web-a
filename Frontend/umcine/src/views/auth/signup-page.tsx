"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  checkEmailAvailability,
  checkNicknameAvailability,
} from "../../api/members/members";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export function SignupPage() {
  const signupMutation = useSignupMutation();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [checkedEmail, setCheckedEmail] = useState("");
  const [checkedNickname, setCheckedNickname] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const validation = useMemo(
    () => ({
      email: emailPattern.test(email),
      nickname: nickname.length >= 2 && nickname.length <= 12,
      password: passwordPattern.test(password),
      passwordConfirm: password.length > 0 && password === passwordConfirm,
    }),
    [email, nickname, password, passwordConfirm],
  );

  async function handleEmailCheck() {
    if (!validation.email) {
      setEmailMessage("올바른 이메일 형식을 입력해 주세요.");
      return;
    }

    try {
      const available = await checkEmailAvailability(email);
      setCheckedEmail(available ? email : "");
      setEmailMessage(available ? "사용 가능한 이메일이에요." : "이미 사용 중인 이메일이에요.");
    } catch {
      setCheckedEmail("");
      setEmailMessage("중복 확인 서버에 연결하지 못했어요.");
    }
  }

  async function handleNicknameCheck() {
    if (!validation.nickname) {
      setNicknameMessage("닉네임은 2자 이상 12자 이하로 입력해 주세요.");
      return;
    }

    try {
      const available = await checkNicknameAvailability(nickname);
      setCheckedNickname(available ? nickname : "");
      setNicknameMessage(available ? "사용 가능한 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setCheckedNickname("");
      setNicknameMessage("중복 확인 서버에 연결하지 못했어요.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitMessage("");

    if (!Object.values(validation).every(Boolean)) {
      setSubmitMessage("입력 내용을 다시 확인해 주세요.");
      return;
    }

    if (checkedEmail !== email || checkedNickname !== nickname) {
      setSubmitMessage("이메일과 닉네임 중복 확인을 완료해 주세요.");
      return;
    }

    if (signupMutation.isPending) return;

    signupMutation.mutate(
      { email: email.trim(), nickname: nickname.trim(), password },
      {
        onError: async (error) => {
          setSubmitMessage(
            await getApiErrorMessage(
              error,
              "회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.",
            ),
          );
        },
      },
    );
  }

  const inputClass =
    "mt-2 h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-white px-4 font-normal outline-none transition focus:border-[var(--color-action-primary)] focus:ring-2 focus:ring-blue-100";

  return (
    <main className="grid min-h-[calc(100vh-91px)] place-items-center bg-[var(--color-bg-page)] px-4 py-12">
      <section className="w-full max-w-[560px] rounded-3xl border border-[var(--color-border-default)] bg-white p-6 shadow-[0_20px_50px_rgba(17,19,24,0.08)] sm:p-10">
        <p className="text-sm font-bold text-[var(--color-action-primary)]">JOIN UMCINE</p>
        <h1 className="mt-2 text-[32px] font-bold tracking-[-1.6px]">회원가입</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          계정을 만들고 나만의 영화 목록을 관리해 보세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-bold">
            이메일
            <span className="mt-2 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setCheckedEmail("");
                  setEmailMessage("");
                }}
                placeholder="example@email.com"
                className={`${inputClass} mt-0 min-w-0 flex-1`}
              />
              <button type="button" onClick={handleEmailCheck} className="shrink-0 cursor-pointer rounded-xl border border-[var(--color-action-primary)] px-4 text-sm font-bold text-[var(--color-action-primary)]">
                중복 확인
              </button>
            </span>
            {emailMessage ? <span className="mt-2 block font-normal text-[var(--color-text-secondary)]">{emailMessage}</span> : null}
          </label>

          <label className="block text-sm font-bold">
            닉네임
            <span className="mt-2 flex gap-2">
              <input
                value={nickname}
                maxLength={12}
                onChange={(event) => {
                  setNickname(event.target.value);
                  setCheckedNickname("");
                  setNicknameMessage("");
                }}
                placeholder="2~12자로 입력해 주세요"
                className={`${inputClass} mt-0 min-w-0 flex-1`}
              />
              <button type="button" onClick={handleNicknameCheck} className="shrink-0 cursor-pointer rounded-xl border border-[var(--color-action-primary)] px-4 text-sm font-bold text-[var(--color-action-primary)]">
                중복 확인
              </button>
            </span>
            {nicknameMessage ? <span className="mt-2 block font-normal text-[var(--color-text-secondary)]">{nicknameMessage}</span> : null}
          </label>

          <label className="block text-sm font-bold">
            비밀번호
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="영문 대·소문자, 숫자, 특수문자 포함 8자 이상" className={inputClass} />
          </label>

          <label className="block text-sm font-bold">
            비밀번호 확인
            <input type="password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} placeholder="비밀번호를 다시 입력해 주세요" className={inputClass} />
            {passwordConfirm && !validation.passwordConfirm ? <span className="mt-2 block font-normal text-[var(--color-danger-default)]">비밀번호가 일치하지 않아요.</span> : null}
          </label>

          {submitMessage ? <p role="alert" className="text-sm text-[var(--color-danger-default)]">{submitMessage}</p> : null}

          <button type="submit" disabled={signupMutation.isPending} className="h-12 w-full cursor-pointer rounded-xl bg-[var(--color-action-primary)] text-sm font-bold text-white transition hover:bg-[var(--color-action-hover)] disabled:cursor-not-allowed disabled:bg-[var(--color-action-disabled)]">
            {signupMutation.isPending ? "가입하는 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-bold text-[var(--color-action-primary)]">로그인</Link>
        </p>
      </section>
    </main>
  );
}
