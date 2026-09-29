import { api } from "@/lib/api";
import type { LoginResponse, User } from "@/types/auth";
import type { LoginInput, SignupInput } from "@/schemas/auth.schema";

export const authService = {
  login: async (data: LoginInput): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/login", data);
    return res.data;
  },

  signup: async (data: Omit<SignupInput, "confirmPassword">): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/signup", data);
    return res.data;
  },

  me: async (): Promise<User> => {
    const res = await api.get<User>("/auth/me");
    return res.data;
  },
};
