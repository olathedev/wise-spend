'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSignInWithGoogle } from '@/hooks/useSignInWithGoogle';

/**
 * Component to handle backend API call after NextAuth sign-in
 * Place this component on pages that users are redirected to after sign-in (e.g., onboarding page)
 * This automatically calls the backend API with the id_token from NextAuth session
 */
export default function AuthCallbackHandler() {
  const { data: session, status } = useSession();
  // Skip redirect since onboarding page handles its own flow
  const signInMutation = useSignInWithGoogle({ skipRedirect: true });

  // Use a ref to ensure we only attempt authentication once
  const hasAttemptedAuth = React.useRef(false);

  useEffect(() => {
    // Wait for session to be loaded
    if (status !== 'authenticated' || !session?.id_token) {
      return;
    }

    // If we've already tried (success or fail) or are currently trying, stop.
    if (hasAttemptedAuth.current || signInMutation.isPending || signInMutation.isSuccess || signInMutation.isError) {
      return;
    }

    // Check if we've already authenticated with backend via localStorage
    const backendToken = localStorage.getItem('auth_token');
    if (backendToken) {
      hasAttemptedAuth.current = true;
      return;
    }

    // Mark as attempted to prevent race conditions or loops
    hasAttemptedAuth.current = true;

    // Call backend API with the id_token from NextAuth session
    signInMutation.mutate(
      { idToken: session.id_token },
      {
        onSuccess: () => {
          console.log('Backend authentication successful');
        },
        onError: (error) => {
          console.error('Backend authentication error:', error);
          // Allow retry on error if needed by resetting ref? 
          // For now, let's block loops.
        },
      }
    );
  }, [session, status, signInMutation.mutate, signInMutation.isPending, signInMutation.isSuccess, signInMutation.isError]);

  return null; // This component doesn't render anything
}
