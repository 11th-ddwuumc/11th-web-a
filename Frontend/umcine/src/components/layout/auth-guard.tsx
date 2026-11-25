"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../stores/auth-store";

export function AuthGuard({ children, guestOnly = false }: {
  children: ReactNode;
  guestOnly?: boolean;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const canEnter = guestOnly ? !accessToken : Boolean(accessToken);

  useEffect(() => {
    if (isHydrated && !canEnter) router.replace(guestOnly ? "/" : "/login");
  }, [canEnter, guestOnly, isHydrated, router]);

  if (!isHydrated || !canEnter) {
    return <p role="status" className="px-4 py-10 text-center">로그인 상태를 확인하는 중이에요.</p>;
  }

  return children;
}
