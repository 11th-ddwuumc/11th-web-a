import { useEffect, useState } from "react";
import {
  getAccessToken,
  getMyFavorites,
  removeFavorite,
  type Favorite,
} from "../../api/favoriteApi";
import "./auth.css";

export function ProfilePage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingMovieId, setRemovingMovieId] = useState<number | null>(null);

  const [nickname, setNickname] = useState("테스트회원");
  const [draftNickname, setDraftNickname] = useState(nickname);
  const [email] = useState("test@example.com");
  const [isEditing, setIsEditing] = useState(false);

  const isLoggedIn = Boolean(getAccessToken());

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadFavorites() {
      try {
        const result = await getMyFavorites();

        if (!cancelled) {
          setFavorites(result);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "즐겨찾기를 불러오지 못했습니다."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleRemoveFavorite = async (movieId: number) => {
    if (!window.confirm("이 영화를 즐겨찾기에서 해제할까요?")) {
      return;
    }

    setRemovingMovieId(movieId);

    try {
      await removeFavorite(movieId);

      setFavorites((current) =>
        current.filter((favorite) => favorite.movieId !== movieId)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "즐겨찾기 해제에 실패했습니다."
      );
    } finally {
      setRemovingMovieId(null);
    }
  };

  const handleEdit = () => {
    setDraftNickname(nickname);
    setIsEditing(true);
  };

  const handleSave = () => {
    const value = draftNickname.trim();

    if (value.length < 2 || value.length > 12) {
      alert("닉네임은 2~12자로 입력해주세요.");
      return;
    }

    setNickname(value);
    setIsEditing(false);
    alert("닉네임은 화면에서만 변경되었습니다.");
  };

  return (
    <main className="profile-page">
      <div className="profile-heading">
        <h1 className="profile-title">내 정보</h1>

        {isEditing ? (
          <div style={{ display: "flex", gap: "8px" }}>
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
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        ) : (
          <button
            className="profile-edit-btn"
            type="button"
            onClick={handleEdit}
          >
            정보 수정
          </button>
        )}
      </div>

      <section>
        <h2 className="profile-section-title">기본 정보</h2>

        <div className="profile-info">
          <div className="profile-avatar" aria-hidden="true">
            👤
          </div>

          <div className="profile-info-item">
            <div className="profile-info-label">닉네임</div>

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
                {nickname}
              </div>
            )}
          </div>

          <div className="profile-info-item">
            <div className="profile-info-label">이메일</div>
            <div className="profile-info-value">{email}</div>
          </div>
        </div>
      </section>

      <section className="profile-favorites">
        <h2 className="profile-section-title">내 즐겨찾기</h2>

        {!isLoggedIn ? (
          <p>즐겨찾기를 보려면 로그인이 필요합니다.</p>
        ) : isLoading ? (
          <p>즐겨찾기를 불러오는 중...</p>
        ) : error ? (
          <p style={{ color: "#dc2626" }}>
            즐겨찾기를 불러오지 못했습니다: {error}
          </p>
        ) : favorites.length === 0 ? (
          <p>아직 즐겨찾기한 영화가 없습니다.</p>
        ) : (
          <div className="profile-movie-list">
            {favorites.map((favorite) => (
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
                  disabled={removingMovieId === favorite.movieId}
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
      </section>
    </main>
  );
}