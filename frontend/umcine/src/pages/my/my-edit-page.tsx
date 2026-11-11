import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";

const MY_EMAIL = "example@email.com";
const MY_NICKNAME = "유엠씨";

export function MyEditPage() {
  const [nickname, setNickname] = useState(MY_NICKNAME);

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center bg-[#f5f5f7] px-6 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 text-left shadow"
      >
        <h1 className="mb-6 text-2xl font-extrabold text-gray-900">
          내 정보 수정
        </h1>

        <label className="text-sm font-semibold text-gray-900">이메일</label>
        <input
          type="email"
          value={MY_EMAIL}
          readOnly
          className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 outline-none"
        />

        <label className="mt-4 block text-sm font-semibold text-gray-900">
          닉네임
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
        />
        {showNicknameError && (
          <p className="mt-1 text-xs text-red-500">
            닉네임은 2자 이상 12자 이하로 입력해 주세요.
          </p>
        )}

        <button
          type="submit"
          disabled={!isNicknameValid}
          className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
        >
          저장
        </button>

        <Link to="/my" className="mt-3 block text-center text-sm text-gray-500">
          취소
        </Link>
      </form>
    </div>
  );
}
