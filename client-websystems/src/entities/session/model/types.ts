import type { User } from "@/entities/user";

export interface LoginCredentials {
  username: string;
  password?: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export type AuthUser = Omit<User, "password">;
