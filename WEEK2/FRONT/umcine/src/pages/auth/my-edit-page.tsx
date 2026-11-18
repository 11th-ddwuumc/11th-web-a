
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMe } from "../../api/members/me";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

import "./auth-pages.css";

export function MyEditPage() {
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 내 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 내 정보 수정
  const updateMeMutation = useUpdateMeMutation();

  const currentNickname = meQuery.data?.nickname ?? "";
  const email = meQuery.data?.email ?? "";

  // 조회한 닉네임을 입력창에 반영
  useEffect(() => {
    if (meQuery.data) {
      setNickname(meQuery.data.nickname);
      setIsNicknameChecked(false);
    }
  }, [meQuery.data]);

  const isNicknameValid =
    nickname.trim().length >= 2 &&
    nickname.trim().length <= 12;

  const isNicknameUnchanged =
    nickname.trim() === currentNickname;

  // 프로필 이미지 미리보기
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("5MB 이하의 이미지만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!isNicknameValid || isChecking) return;

    if (isNicknameUnchanged) {
      setIsNicknameChecked(true);
      alert("현재 사용 중인 닉네임입니다.");
      return;
    }

    setIsChecking(true);

    try {
      const response = await checkNicknameDuplicate(nickname.trim());

      setIsNicknameChecked(response.available);

      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요."
      );
    } catch (error) {
      console.error(error);
      setIsNicknameChecked(false);
      alert("닉네임 중복 확인에 실패했어요.");
    } finally {
      setIsChecking(false);
    }
  };

  // 수정 요청
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isNicknameValid || updateMeMutation.isPending) return;

    if (isNicknameUnchanged) {
      alert("변경된 닉네임이 없습니다.");
      return;
    }

    if (!isNicknameChecked || isChecking) {
      alert("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    updateMeMutation.mutate({
      nickname: nickname.trim(),
    });
  };

  if (meQuery.isLoading) {
    return <main className="mypage">내 정보를 불러오는 중...</main>;
  }

  if (meQuery.isError) {
    return <main className="mypage">내 정보를 불러오지 못했어요.</main>;
  }

  return (
    <main className="mypage mypage-edit">
      <div className="mypage-inner">
        <form onSubmit={handleSubmit}>
          <header className="mypage-heading">
            <div>
              <h1>내 정보 수정</h1>
              <p>닉네임과 프로필 이미지를 확인할 수 있어요.</p>
            </div>

            <button
              type="submit"
              className="mypage-primary"
              disabled={
                !isNicknameValid ||
                isNicknameUnchanged ||
                (!isNicknameUnchanged && !isNicknameChecked) ||
                isChecking ||
                updateMeMutation.isPending
              }
            >
              {updateMeMutation.isPending
                ? "저장 중..."
                : "변경사항 저장"}
            </button>
          </header>

          <div className="profile-edit-layout">
            {/* 프로필 이미지 */}
            <div className="profile-image-editor">
              <button
                type="button"
                className="profile-image-button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="프로필 이미지 변경"
              >
                <div className="profile-avatar">
                  {profileImage ? (
                    <img src={profileImage} alt="프로필 미리보기" />
                  ) : (
                    <svg viewBox="0 0 64 64" aria-hidden="true">
                      <circle cx="32" cy="22" r="10" fill="currentColor" />
                      <path
                        d="M12 53c0-12 9-19 20-19s20 7 20 19"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </div>
                <span className="profile-edit-icon">✎</span>
              </button>

              <strong>프로필 이미지</strong>
              <p>선택 사항 · 최대 5MB (미리보기만 지원)</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </div>

            {/* 정보 수정 입력창 */}
            <div className="profile-edit-fields">
              <div className="signup-field">
                <label htmlFor="edit-nickname">닉네임</label>

                <div className="signup-input-group">
                  <input
                    id="edit-nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setIsNicknameChecked(false);
                    }}
                    disabled={isChecking || updateMeMutation.isPending}
                  />

                  <button
                    type="button"
                    className="signup-check-button"
                    onClick={handleNicknameCheck}
                    disabled={
                      !isNicknameValid ||
                      isChecking ||
                      updateMeMutation.isPending
                    }
                  >
                    {isChecking ? "확인 중" : "중복 확인"}
                  </button>
                </div>

                {isNicknameChecked && (
                  <p className="signup-helper">
                    사용 가능한 닉네임입니다.
                  </p>
                )}
              </div>

              <div className="signup-field">
                <label htmlFor="edit-email">이메일</label>

                <input
                  id="edit-email"
                  className="signup-input"
                  type="email"
                  value={email}
                  readOnly
                />
              </div>
            </div>
          </div>
        </form>

        {/* 회원 탈퇴 영역 */}
        <section className="withdraw-section">
          <div>
            <h2>회원 탈퇴</h2>
            <p>
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되어
              복구할 수 없습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              alert("회원 탈퇴 기능은 아직 구현되지 않았습니다.")
            }
          >
            회원 탈퇴
          </button>
        </section>
      </div>
    </main>
  );
}
