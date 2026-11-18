import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MyEditPage() {
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });
  const me = meQuery.data;

  const [inputNickname, setInputNickname] = useState<string | null>(null);

  let nickname = "";
  if (inputNickname !== null) {
    nickname = inputNickname;
  } else if (me) {
    nickname = me.nickname;
  }

  const updateMeMutation = useUpdateMeMutation();

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;
  const canSubmit = isNicknameValid;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;
    updateMeMutation.mutate({ nickname: nickname.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-0 w-full flex-1 flex-col bg-[#f5f5f7]"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              내 정보 수정
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
            className="rounded-lg bg-[#5B5CEB] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-8">
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <img
                src="/icons/movie-icons/person.svg"
                alt=""
                className="h-6 w-6"
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-gray-900">
              프로필 이미지
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-900">
              닉네임
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setInputNickname(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-16 text-sm outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5B5CEB]"
              >
                중복 확인
              </button>
            </div>
            {showNicknameError && (
              <p className="mt-1 text-xs text-red-500">
                닉네임은 2자 이상 12자 이하로 입력해 주세요.
              </p>
            )}

            <label className="mt-4 block text-xs font-semibold text-gray-900">
              이메일
            </label>
            <input
              type="email"
              value={me ? me.email : ""}
              readOnly
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
          <div>
            <p className="text-xs font-bold text-red-600">회원 탈퇴</p>
            <p className="mt-1 text-[11px] text-red-500">
              탈퇴하면 계정과 즐겨찾기 정보가 삭제되며 복구할 수 없어요.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </form>
  );
}
