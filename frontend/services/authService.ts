import apiClient from "./axios";

export interface SignInWithGoogleRequest {
  idToken: string;
}

export interface SignInWithGoogleResponse {
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string | null;
    googleId: string;
    onboardingCompleted: boolean;
    monthlyIncome: number | null;
    financialGoals: string[] | null;
    coachPersonality: string | null;
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

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
};

export interface GetCurrentUserResponse {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  googleId: string;
  onboardingCompleted: boolean;
  monthlyIncome: number | null;
  financialGoals: string[] | null;
  goalTargets: Record<string, number> | null;
  coachPersonality: string | null;
  wiseScore: number | null;
  wiseScoreUpdatedAt: string | null;
  wiseScoreTier: string | null;
}

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  const response = await apiClient.get<ApiResponse<GetCurrentUserResponse>>(
    "/auth/me",
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to get current user",
    );
  }

  return response.data.data;
};

export interface UpdateProfileRequest {
  monthlyIncome?: number;
  financialGoals?: string[];
  goalTargets?: Record<string, number>;
  coachPersonality?: string;
}

export const updateProfile = async (
  request: UpdateProfileRequest
): Promise<GetCurrentUserResponse> => {
  try {
    const response = await apiClient.patch<ApiResponse<GetCurrentUserResponse>>(
      "/auth/profile",
      request
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.error?.message || "Failed to update profile",
      );
    }

    return response.data.data;
  } catch (error: any) {
    // Handle axios errors (400, 500, etc.)
    if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export interface ComputeWiseScoreResponse {
  wiseScore: number;
  wiseScoreTier: string;
  wiseScoreUpdatedAt: string;
}

export const computeWiseScore = async (): Promise<ComputeWiseScoreResponse> => {
  const response = await apiClient.post<ApiResponse<ComputeWiseScoreResponse>>(
    "/ai/wise-score"
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Failed to compute Wise Score"
    );
  }

  return response.data.data;
};
