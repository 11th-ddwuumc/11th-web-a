import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRating } from "../api/ratings/add-rating";
import { updateRating } from "../api/ratings/update-rating";
import { removeRating } from "../api/ratings/remove-rating";

export function useAddRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useRemoveRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
