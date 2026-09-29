export type Role = "INVENTORY_MANAGER" | "WAREHOUSE_STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}