import apiClient from './axios';

export interface SignInWithGoogleRequest {
  idToken: string;
}

export interface SignInWithGoogleResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}

export const signInWithGoogle = async (
  request: SignInWithGoogleRequest
): Promise<SignInWithGoogleResponse> => {
  const response = await apiClient.post<ApiResponse<SignInWithGoogleResponse>>(
    '/auth/google',
    {
      idToken: request.idToken,
    }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error?.message || 'Failed to sign in with Google');
  }

  return response.data.data;
};
