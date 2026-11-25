"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMe,
  updateNickname,
} from "../../api/authApi";
import {
  getMyFavorites,
  removeFavorite,
} from "../../api/favoriteApi";
import { useAuthStore } from "../../stores/auth-store";
import "./auth.css";

export function ProfilePage() {
  const navigate = useRouter();
  const queryClient = useQueryClient();

  const setAccessToken = useAuthStore(
    (state) => state.setAccessToken,
  );

  const [draftNickname, setDraftNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [removingMovieId, setRemovingMovieId] = useState<
    number | null
  >(null);

  const memberQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
  });

  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getMyFavorites,
  });

  const updateNicknameMutation = useMutation({
    mutationFn: updateNickname,
    onSuccess: (member) => {
      queryClient.setQueryData(
        ["members", "me"],
        member,
      );
      setIsEditing(false);
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
    onSettled: () => {
      setRemovingMovieId(null);
    },
  });

  function handleEdit() {
    setDraftNickname(memberQuery.data?.nickname ?? "");
    setIsEditing(true);
  }

  function handleSave() {
    const nickname = draftNickname.trim();

    if (nickname.length < 2 || nickname.length > 12) {
      alert("닉네임은 2~12자로 입력해주세요.");
      return;
    }

    updateNicknameMutation.mutate(nickname);
  }

  function handleRemoveFavorite(movieId: number) {
    if (!window.confirm("이 영화를 즐겨찾기에서 해제할까요?")) {
      return;
    }

    setRemovingMovieId(movieId);
    removeFavoriteMutation.mutate(movieId);
  }

  async function handleLogout() {
    setAccessToken(null);
    queryClient.clear();

    navigate.push("/login");
  }

  if (memberQuery.isPending) {
    return (
      <main className="profile-page" role="status">
        회원 정보를 불러오는 중...
      </main>
    );
  }

  if (memberQuery.isError) {
    return (
      <main className="profile-page">
        <h1 className="profile-title">내 정보</h1>

        <p className="auth-error" role="alert">
          {memberQuery.error.message}
        </p>

        <button
          className="profile-edit-btn"
          type="button"
          onClick={() => void memberQuery.refetch()}
        >
          다시 시도
        </button>

        <button
          className="profile-edit-btn"
          type="button"
          onClick={() => void handleLogout()}
          style={{ marginLeft: "8px" }}
        >
          로그아웃
        </button>
      </main>
    );
  }

  const member = memberQuery.data;

  return (
    <main className="profile-page">
      <div className="profile-heading">
        <h1 className="profile-title">
          내 정보
        </h1>

        <div style={{ display: "flex", gap: "8px" }}>
          {isEditing ? (
            <>
              <button
                className="profile-edit-btn"
                type="button"
                style={{ background: "#6b7280" }}
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>

              <button
                className="profile-edit-btn"
                type="button"
                disabled={updateNicknameMutation.isPending}
                onClick={handleSave}
              >
                {updateNicknameMutation.isPending
                  ? "저장 중..."
                  : "저장"}
              </button>
            </>
          ) : (
            <button
              className="profile-edit-btn"
              type="button"
              onClick={handleEdit}
            >
              정보 수정
            </button>
          )}

          <button
            className="profile-edit-btn"
            type="button"
            onClick={() => void handleLogout()}
            style={{ background: "#6b7280" }}
          >
            로그아웃
          </button>
        </div>
      </div>

      <section>
        <h2 className="profile-section-title">
          기본 정보
        </h2>

        <div className="profile-info">
          <div
            className="profile-avatar"
            aria-hidden="true"
          >
            👤
          </div>

          <div className="profile-info-item">
            <div className="profile-info-label">
              닉네임
            </div>

            {isEditing ? (
              <input
                className="profile-input"
                value={draftNickname}
                onChange={(event) =>
                  setDraftNickname(event.target.value)
                }
              />
            ) : (
              <div className="profile-info-value">
                {member.nickname}
              </div>
            )}
          </div>

          <div className="profile-info-item">
            <div className="profile-info-label">
              이메일
            </div>

            <div className="profile-info-value">
              {member.email}
            </div>
          </div>
        </div>

        {updateNicknameMutation.isError && (
          <p className="auth-error" role="alert">
            {updateNicknameMutation.error.message}
          </p>
        )}
      </section>

      <section className="profile-favorites">
        <h2 className="profile-section-title">
          내 즐겨찾기
        </h2>

        {favoritesQuery.isPending ? (
          <p>즐겨찾기를 불러오는 중...</p>
        ) : favoritesQuery.isError ? (
          <div>
            <p style={{ color: "#dc2626" }}>
              {favoritesQuery.error.message}
            </p>

            <button
              type="button"
              onClick={() => void favoritesQuery.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : favoritesQuery.data.length === 0 ? (
          <p>아직 즐겨찾기한 영화가 없습니다.</p>
        ) : (
          <div className="profile-movie-list">
            {favoritesQuery.data.map((favorite) => (
              <div
                className="profile-movie"
                key={favorite.favoriteId}
              >
                <div
                  className="profile-movie-poster"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#e5e7eb",
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  영화 포스터
                </div>

                <p className="profile-movie-title">
                  영화 ID: {favorite.movieId}
                </p>

                <p className="profile-movie-date">
                  등록일:{" "}
                  {favorite.createdAt.slice(0, 10)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleRemoveFavorite(favorite.movieId)
                  }
                  disabled={
                    removingMovieId === favorite.movieId
                  }
                  style={{
                    marginTop: "10px",
                    padding: "7px 10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "5px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  {removingMovieId === favorite.movieId
                    ? "해제 중..."
                    : "즐겨찾기 해제"}
                </button>
              </div>
            ))}
          </div>
        )}

        {removeFavoriteMutation.isError && (
          <p className="auth-error" role="alert">
            {removeFavoriteMutation.error.message}
          </p>
        )}
      </section>
    </main>
  );
}
