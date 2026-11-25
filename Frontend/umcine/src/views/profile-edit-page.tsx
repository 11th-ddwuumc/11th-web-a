"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { getMe, type MemberInfo } from "../api/members/me";
import { useUpdateMeMutation } from "../hooks/use-update-me-mutation";
import { getApiErrorMessage } from "../utils/get-api-error-message";

interface ProfileEditFormProps {
  member: MemberInfo;
}

function ProfileEditForm({ member }: ProfileEditFormProps) {
  const updateMeMutation = useUpdateMeMutation();
  const [nickname, setNickname] = useState(member.nickname);
  const [errorMessage, setErrorMessage] = useState("");
  const normalizedNickname = nickname.trim();
  const canSubmit =
    normalizedNickname.length >= 2 && normalizedNickname.length <= 12;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    setErrorMessage("");
    updateMeMutation.mutate(
      { nickname: normalizedNickname },
      {
        onError: async (error) => {
          setErrorMessage(
            await getApiErrorMessage(
              error,
              "내 정보 수정에 실패했어요. 다시 시도해 주세요.",
            ),
          );
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block text-sm font-bold">
        이메일
        <input disabled value={member.email} className="mt-2 h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-page)] px-4 font-normal text-[var(--color-text-secondary)]" />
      </label>
      <label className="block text-sm font-bold">
        닉네임
        <input value={nickname} maxLength={12} onChange={(event) => setNickname(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[var(--color-border-default)] px-4 font-normal outline-none focus:border-[var(--color-action-primary)] focus:ring-2 focus:ring-blue-100" />
        <span className="mt-2 block font-normal text-[var(--color-text-secondary)]">2자 이상 12자 이하로 입력해 주세요.</span>
      </label>

      {errorMessage ? <p role="alert" className="text-sm text-[var(--color-danger-default)]">{errorMessage}</p> : null}
      {updateMeMutation.isSuccess ? <p role="status" className="text-sm text-[var(--color-action-primary)]">수정한 정보가 바로 반영됐어요.</p> : null}

      <button type="submit" disabled={!canSubmit || updateMeMutation.isPending} className="h-12 w-full cursor-pointer rounded-xl bg-[var(--color-action-primary)] font-bold text-white disabled:cursor-not-allowed disabled:bg-[var(--color-action-disabled)]">
        {updateMeMutation.isPending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}

export function ProfileEditPage() {
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[var(--color-bg-page)] px-4 py-10 sm:px-8 lg:px-20">
      <section className="mx-auto max-w-2xl rounded-3xl border border-[var(--color-border-default)] bg-white p-6 shadow-[0_14px_40px_rgba(17,19,24,0.06)] sm:p-10">
        <Link href="/myPage" className="text-sm font-bold text-[var(--color-action-primary)]">← 내 정보로 돌아가기</Link>
        <h1 className="mt-5 text-3xl font-bold">내 정보 수정</h1>

        {meQuery.isPending ? (
          <p className="py-12 text-[var(--color-text-secondary)]">내 정보를 불러오는 중이에요.</p>
        ) : meQuery.isError ? (
          <p className="py-12 text-[var(--color-danger-default)]">내 정보를 불러오지 못했어요.</p>
        ) : (
          <ProfileEditForm key={meQuery.data.nickname} member={meQuery.data} />
        )}
      </section>
    </main>
  );
}
