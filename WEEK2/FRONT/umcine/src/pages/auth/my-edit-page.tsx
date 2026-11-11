
import { useState } from "react";
import { useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "./auth-pages.css";

export function MyEditPage() {
  const [nickname, setNickname] = useState("gs0428");
  const [email] = useState("gwangsoo@cinemalab.kr");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNicknameValid =
    nickname.trim().length >= 2 &&
    nickname.trim().length <= 12;

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

  const handleNicknameCheck = () => {
    if (!isNicknameValid) {
      alert("닉네임은 2~12자로 입력해 주세요.");
      return;
    }

    // 7주차에서는 중복 확인 UI만 구현
    setIsNicknameChecked(true);
    alert("닉네임 중복 확인 API는 추후 연결합니다.");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isNicknameValid) {
      alert("닉네임 조건을 확인해 주세요.");
      return;
    }

    alert(
      "변경사항이 화면에 반영되었습니다.\n" +
      "실제 서버 저장 기능은 아직 연결되지 않았습니다."
    );
  };

  return (
    <main className="mypage mypage-edit">
      <div className="mypage-inner">
        <form onSubmit={handleSubmit}>
          <header className="mypage-heading">
            <div>
              <h1>내 정보 수정</h1>
              <p>닉네임과 프로필 이미지만 변경할 수 있어요.</p>
            </div>

            <button type="submit" className="mypage-primary">
              변경사항 저장
            </button>
          </header>

          <div className="profile-edit-layout">
            {/* 프로필 이미지 변경 */}
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
              <p>선택 사항 · 최대 5MB</p>

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
                  />

                  <button
                    type="button"
                    className="signup-check-button"
                    onClick={handleNicknameCheck}
                    disabled={!isNicknameValid}
                  >
                    중복 확인
                  </button>
                </div>
                {isNicknameChecked && (
                  <p className="signup-helper">
                    중복 확인 API 연결 전입니다.
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
