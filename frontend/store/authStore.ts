import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  googleId: string;
  onboardingCompleted: boolean;
  monthlyIncome: number | null;
  financialGoals: string[] | null;
  coachPersonality: string | null;
}

const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "user";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        set({ user, token });
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!(get().token && get().user),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    },
  ),
);
