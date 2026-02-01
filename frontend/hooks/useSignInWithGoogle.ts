"use client";

import { useMutation } from "@tanstack/react-query";
import {
  signInWithGoogle,
  SignInWithGoogleRequest,
  SignInWithGoogleResponse,
} from "@/services/authService";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface UseSignInWithGoogleOptions {
  onSuccessRedirect?: string;
  skipRedirect?: boolean;
}

export const useSignInWithGoogle = (options?: UseSignInWithGoogleOptions) => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { onSuccessRedirect = "/dashboard", skipRedirect = false } =
    options || {};

  return useMutation<SignInWithGoogleResponse, Error, SignInWithGoogleRequest>({
    mutationFn: signInWithGoogle,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      // Redirect only if not skipped (e.g., onboarding page handles its own flow)
      if (!skipRedirect) {
        if (data.onboardingCompleted) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
    },
    onError: (error) => {
      console.error("Sign in error:", error);
      // You can add toast notification here if needed
    },
  });
};
