import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";
import { removeFavorite } from "../api/favorites/remove-favorite";

export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: () => {
      queryClient.getQueriesData({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 추가에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
