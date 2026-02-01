import apiClient from "./axios";

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
  onboardingCompleted: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}

export const signInWithGoogle = async (
  request: SignInWithGoogleRequest,
): Promise<SignInWithGoogleResponse> => {
  const response = await apiClient.post<ApiResponse<SignInWithGoogleResponse>>(
    "/auth/google",
    {
      idToken: request.idToken,
    },
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to sign in with Google",
    );
  }

  return response.data.data;
};

export interface CompleteOnboardingRequest {
  monthlyIncome: string;
  financialGoals: string[];
  coachPersonality: string;
}

export interface CompleteOnboardingResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    monthlyIncome?: number;
    financialGoals?: string[];
    coachPersonality?: string;
  };
}

export const completeOnboarding = async (
  request: CompleteOnboardingRequest,
): Promise<CompleteOnboardingResponse> => {
  const response = await apiClient.put<ApiResponse<CompleteOnboardingResponse>>(
    "/auth/onboarding",
    {
      monthlyIncome: request.monthlyIncome,
      financialGoals: request.financialGoals,
      coachPersonality: request.coachPersonality,
    },
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to complete onboarding",
    );
  }

  return response.data.data;
};
