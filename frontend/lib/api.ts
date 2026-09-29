import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenStore } from "@/lib/token";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Har request mein access token lagao
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Ek time par sirf ek refresh call ho, isliye promise share karte hain
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new Error("No refresh token");

  // Naya axios call (api nahi), warna interceptor loop ban jayega
  const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
  const { accessToken, refreshToken: newRefresh } = res.data;

  tokenStore.set(accessToken, newRefresh);
  return accessToken;
}

// 401 aaye to refresh karke request dobara bhejo
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const isAuthCall = original?.url?.startsWith("/auth/");

    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        tokenStore.clear();
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Backend ka error message user-friendly form mein nikalne ke liye
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
    if (!error.response) return "Server se connect nahi ho paya";
  }
  return "Kuch galat ho gaya, dobara try karo";
}