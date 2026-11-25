import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signUp } from "../api/members/members";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      router.push("/login");
    },
  });
}
