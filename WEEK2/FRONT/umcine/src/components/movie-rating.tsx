
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import {
  createRating,
  updateRating,
  deleteRating,
  getMemberRatings,
} from "../api/ratings";
import { useAuthStore } from "../stores/auth-store";

interface MovieRatingProps {
  movieId: number;
}

export function MovieRating({ movieId }: MovieRatingProps) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    retry: false,
  });

  const memberId = meQuery.data?.memberId;

  const ratingsQuery = useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(accessToken && memberId),
    retry: false,
  });

  const existingRating = ratingsQuery.data?.find(
    (rating) => rating.movieId === movieId,
  );

  useEffect(() => {
    if (existingRating) {
      setScore(existingRating.score);
      setComment(existingRating.comment ?? "");
    }
  }, [existingRating]);

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["ratings"],
    });
  };

  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      refresh();
      alert("평점이 등록됐어요.");
    },
    onError: () => alert("평점 등록에 실패했어요."),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateRating(existingRating!.ratingId, { score, comment }),
    onSuccess: () => {
      refresh();
      alert("평점이 수정됐어요.");
    },
    onError: () => alert("평점 수정에 실패했어요."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRating(existingRating!.ratingId),
    onSuccess: () => {
      setScore(0);
      setComment("");
      refresh();
      alert("평점이 삭제됐어요.");
    },
    onError: () => alert("평점 삭제에 실패했어요."),
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSave = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      return;
    }

    if (score < 1 || score > 5 || isPending) return;

    if (existingRating) {
      updateMutation.mutate();
    } else {
      createMutation.mutate({ movieId, score, comment });
    }
  };

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900">
        내 평점
      </h2>

      <p className="mt-1 text-[10px] text-gray-400">
        별점을 눌러 평가해주세요.
      </p>

      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setScore(star)}
            disabled={isPending}
            aria-label={`${star}점`}
            aria-pressed={score === star}
            className={`flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-sm ${
              star <= score ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-3 h-14 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-[10px] outline-none placeholder:text-gray-400"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={score === 0 || isPending || !accessToken}
        className="mt-2 h-8 w-full rounded-md bg-gray-900 text-xs font-semibold text-white disabled:opacity-50"
      >
        {isPending
          ? "처리 중..."
          : existingRating
            ? "평점 수정"
            : "평점 저장"}
      </button>

      {existingRating && (
        <button
          type="button"
          onClick={() => deleteMutation.mutate()}
          disabled={isPending}
          className="mt-2 h-8 w-full rounded-md border border-red-300 text-xs text-red-600"
        >
          평점 삭제
        </button>
      )}
    </div>
  );
}
