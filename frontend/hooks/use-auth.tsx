"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { tokenStore } from "@/lib/token";
import type { LoginResponse, Role, User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (data: LoginResponse) => void;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Page refresh par token se user wapas load karo
  useEffect(() => {
    const load = async () => {
      if (!tokenStore.getAccess()) {
        setIsLoading(false);
        return;
      }
      try {
        setUser(await authService.me());
      } catch {
        tokenStore.clear();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const setSession = useCallback((data: LoginResponse) => {
    tokenStore.set(data.accessToken, data.refreshToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    router.push("/login");
  }, [router]);

  const hasRole = useCallback(
    (...roles: Role[]) => !!user && roles.includes(user.role),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      setSession,
      logout,
      hasRole,
    }),
    [user, isLoading, setSession, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}