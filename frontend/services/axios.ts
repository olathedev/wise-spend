import axios from "axios";
import { getSession } from "next-auth/react";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    // Use backend JWT for protected routes (stored after /auth/google)
    if (typeof window !== "undefined") {
      const backendToken = localStorage.getItem("auth_token");
      if (backendToken) {
        config.headers["Authorization"] = `Bearer ${backendToken}`;
        return config;
      }
    }
    // Fallback: use Google id_token for unauthenticated calls (e.g. /auth/google)
    const session = await getSession();
    if (session?.id_token) {
      config.headers["Authorization"] = `Bearer ${session.id_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
