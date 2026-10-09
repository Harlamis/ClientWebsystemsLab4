import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AuthUser, LoginCredentials } from "../types/auth";
import { ServiceProvider } from "../services/service-provider";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string>(localStorage.getItem("accessToken") || "");
  const refreshToken = ref<string>(localStorage.getItem("refreshToken") || "");
  const user = ref<AuthUser | null>(
    localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")!)
      : null,
  );

  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginCredentials) => {
    const data = await ServiceProvider.auth.login(credentials);
    token.value = data.accessToken;
    refreshToken.value = data.refreshToken;
    user.value = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
      age: 0,
      phone: "",
    };

    localStorage.setItem("accessToken", token.value);
    localStorage.setItem("refreshToken", refreshToken.value);
    localStorage.setItem("authUser", JSON.stringify(user.value));
  };

  const refreshTokens = async (): Promise<boolean> => {
    if (!refreshToken.value) return false;
    try {
      const data = await ServiceProvider.auth.refresh(refreshToken.value);
      token.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      localStorage.setItem("accessToken", token.value);
      localStorage.setItem("refreshToken", refreshToken.value);
      return true;
    } catch {
      logout();
      return false;
    }
  };

  const logout = () => {
    token.value = "";
    refreshToken.value = "";
    user.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
  };

  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    login,
    refreshTokens,
    logout,
  };
});
