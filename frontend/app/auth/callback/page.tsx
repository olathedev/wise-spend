"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

/**
 * Auth callback page: user lands here after Google sign-in (NextAuth).
 * We call the backend sign-in endpoint with the Google id_token, get user details
 * (including onboardingCompleted), then redirect to dashboard or onboarding.
 */
export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const hasCalledBackend = useRef(false);

  useEffect(() => {
    // Not ready or no session → wait or send to sign-in
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
      return;
    }
    if (status !== "authenticated" || !session?.id_token) {
      return;
    }

    // Only call backend once
    if (hasCalledBackend.current) return;
    hasCalledBackend.current = true;

    signInWithGoogle({ idToken: session.id_token })
      .then((data) => {
        setAuth(data.user, data.token);
        if (data.onboardingCompleted) {
          router.replace("/dashboard");
        } else {
          router.replace("/onboarding");
        }
      })
      .catch((err) => {
        console.error("Backend sign-in error:", err);
        router.replace("/auth/signin");
      });
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-slate-600 font-medium">Signing you in...</p>
      </div>
    </div>
  );
}
