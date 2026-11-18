
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavoriteStatus,
  removeFavorite,
} from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useFavorite(movieId: number) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  const favoriteQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: () => addFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
    onError: () => alert("즐겨찾기 등록에 실패했어요."),
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
    onError: () => alert("즐겨찾기 해제에 실패했어요."),
  });

  return {
    isLoggedIn: Boolean(accessToken),
    isFavorite: favoriteQuery.data?.isFavorite ?? false,
    isLoading: favoriteQuery.isLoading,
    isError: favoriteQuery.isError,
    isPending: addMutation.isPending || removeMutation.isPending,
    toggleFavorite: () => {
      if (favoriteQuery.data?.isFavorite) {
        removeMutation.mutate();
      } else {
        addMutation.mutate();
      }
    },
  };
}
