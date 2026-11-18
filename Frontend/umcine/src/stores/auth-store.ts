import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);

export function getMemberIdFromToken(accessToken: string | null) {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;

    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const claims = JSON.parse(atob(normalizedPayload)) as {
      sub?: string;
      memberId?: number;
    };
    const memberId = Number(claims.sub ?? claims.memberId);

    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
