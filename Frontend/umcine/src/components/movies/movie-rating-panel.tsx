import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
  type Rating,
} from "../../api/ratings/ratings";
import { getMemberIdFromToken, useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

interface MovieRatingPanelProps {
  movieId: number;
}

interface RatingFormProps {
  savedRating?: Rating;
  isSaving: boolean;
  isDeleting: boolean;
  errorMessage: string;
  isSaveSuccess: boolean;
  onSave: (score: number, comment: string) => void;
  onDelete: () => void;
}

function RatingForm({
  savedRating,
  isSaving,
  isDeleting,
  errorMessage,
  isSaveSuccess,
  onSave,
  onDelete,
}: RatingFormProps) {
  const [score, setScore] = useState(savedRating?.score ?? 5);
  const [comment, setComment] = useState(savedRating?.comment ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSaving) onSave(score, comment.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <label className="block text-sm font-bold">
        별점
        <select value={score} onChange={(event) => setScore(Number(event.target.value))} className="ml-3 rounded-lg border border-[var(--color-border-default)] bg-white px-3 py-2 font-normal outline-none focus:border-[var(--color-action-primary)]">
          {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}점</option>)}
        </select>
      </label>
      <label className="block text-sm font-bold">
        한줄 후기
        <textarea value={comment} maxLength={500} onChange={(event) => setComment(event.target.value)} placeholder="영화에 대한 후기를 남겨 주세요." className="mt-2 min-h-24 w-full resize-y rounded-xl border border-[var(--color-border-default)] p-3 font-normal outline-none focus:border-[var(--color-action-primary)] focus:ring-2 focus:ring-blue-100" />
      </label>

      {errorMessage ? <p role="alert" className="text-sm text-[var(--color-danger-default)]">{errorMessage}</p> : null}
      {isSaveSuccess ? <p role="status" className="text-sm text-[var(--color-action-primary)]">평점이 저장됐어요.</p> : null}

      <div className="flex gap-2">
        <button type="submit" disabled={isSaving} className="h-11 cursor-pointer rounded-xl bg-[var(--color-action-primary)] px-5 text-sm font-bold text-white disabled:cursor-wait disabled:bg-[var(--color-action-disabled)]">
          {isSaving ? "저장 중..." : savedRating ? "평점 수정" : "평점 등록"}
        </button>
        {savedRating ? (
          <button type="button" onClick={onDelete} disabled={isDeleting} className="h-11 cursor-pointer rounded-xl border border-[var(--color-border-default)] px-5 text-sm font-bold text-[var(--color-danger-default)] disabled:cursor-wait disabled:opacity-50">
            {isDeleting ? "삭제 중..." : "평점 삭제"}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function MovieRatingPanel({ movieId }: MovieRatingPanelProps) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);
  const ratingsQueryKey = ["ratings", "member", memberId] as const;
  const ratingsQuery = useQuery({
    queryKey: ratingsQueryKey,
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
    retry: false,
  });
  const savedRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);
  const [errorMessage, setErrorMessage] = useState("");
  const saveMutation = useMutation({
    mutationFn: ({ score, comment }: { score: number; comment: string }) =>
      savedRating
        ? updateRating(savedRating.ratingId, { score, comment })
        : createRating({ movieId, score, comment }),
    onSuccess: (response) => {
      queryClient.setQueryData<Rating[]>(ratingsQueryKey, (ratings = []) => {
        const hasRating = ratings.some((rating) => rating.ratingId === response.result.ratingId);
        return hasRating
          ? ratings.map((rating) => rating.ratingId === response.result.ratingId ? response.result : rating)
          : [response.result, ...ratings];
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: (_, ratingId) => {
      queryClient.setQueryData<Rating[]>(ratingsQueryKey, (ratings = []) =>
        ratings.filter((rating) => rating.ratingId !== ratingId),
      );
    },
  });

  async function handleMutationError(error: unknown) {
    setErrorMessage(await getApiErrorMessage(error, "평점 요청에 실패했어요. 다시 시도해 주세요."));
  }

  function handleSave(score: number, comment: string) {
    setErrorMessage("");
    saveMutation.mutate({ score, comment }, { onError: handleMutationError });
  }

  function handleDelete() {
    if (!savedRating || deleteMutation.isPending) return;
    setErrorMessage("");
    deleteMutation.mutate(savedRating.ratingId, { onError: handleMutationError });
  }

  if (!accessToken) {
    return <div className="mt-8 rounded-xl bg-[var(--color-bg-page)] p-5 text-sm text-[var(--color-text-secondary)]">평점을 남기려면 <Link to="/login" className="font-bold text-[var(--color-action-primary)]">로그인</Link>해 주세요.</div>;
  }

  if (!memberId) {
    return <p className="mt-8 text-sm text-[var(--color-danger-default)]">토큰에서 회원 번호를 확인하지 못했어요. 다시 로그인해 주세요.</p>;
  }

  return (
    <section className="mt-8 border-t border-[var(--color-border-default)] pt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">내 평점</h2>
        {savedRating ? <span className="text-sm text-[var(--color-text-secondary)]">등록된 평점을 수정할 수 있어요.</span> : null}
      </div>

      {ratingsQuery.isPending ? (
        <p className="py-6 text-sm text-[var(--color-text-secondary)]">평점 정보를 불러오는 중이에요.</p>
      ) : ratingsQuery.isError ? (
        <p className="py-6 text-sm text-[var(--color-danger-default)]">평점 정보를 불러오지 못했어요.</p>
      ) : (
        <RatingForm
          key={savedRating ? `${savedRating.ratingId}-${savedRating.updatedAt}` : "new"}
          savedRating={savedRating}
          isSaving={saveMutation.isPending}
          isDeleting={deleteMutation.isPending}
          errorMessage={errorMessage}
          isSaveSuccess={saveMutation.isSuccess}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}
