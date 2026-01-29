'use client';

import { useMutation } from '@tanstack/react-query';
import { signInWithGoogle, SignInWithGoogleRequest, SignInWithGoogleResponse } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface UseSignInWithGoogleOptions {
  onSuccessRedirect?: string;
  skipRedirect?: boolean;
}

export const useSignInWithGoogle = (options?: UseSignInWithGoogleOptions) => {
  const router = useRouter();
  const { onSuccessRedirect = '/dashboard', skipRedirect = false } = options || {};

  return useMutation<SignInWithGoogleResponse, Error, SignInWithGoogleRequest>({
    mutationFn: signInWithGoogle,
    onSuccess: (data) => {
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Redirect only if not skipped (e.g., onboarding page handles its own flow)
      if (!skipRedirect) {
        router.push(onSuccessRedirect);
      }
    },
    onError: (error) => {
      console.error('Sign in error:', error);
      // You can add toast notification here if needed
    },
  });
};
