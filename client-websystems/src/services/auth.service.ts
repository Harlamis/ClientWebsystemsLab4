import { http } from "../api/http-client";
import type {
  LoginCredentials,
  AuthResponse,
  AuthUser,
  RefreshResponse,
} from "../types/auth";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return http<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async me(): Promise<AuthUser> {
    return http<AuthUser>("/auth/me");
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    return http<RefreshResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken, expiresInMins: 60 }),
    });
  }
}
