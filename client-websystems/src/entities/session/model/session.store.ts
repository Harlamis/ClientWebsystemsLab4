import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ServiceProvider } from "@/shared/api";
import type { AuthService } from "../api/auth.service";
import type { LoginCredentials, AuthUser } from "./types";

export const useSessionStore = defineStore(
  "session",
  () => {
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const user = ref<AuthUser | null>(null);

    const isAuthenticated = computed(() => !!accessToken.value);

    const authService = () => ServiceProvider.get<AuthService>("auth");

    async function login(credentials: LoginCredentials) {
      const data = await authService().login(credentials);
      accessToken.value = data.accessToken;
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

      localStorage.setItem("session:token", data.accessToken);
    }

    function logout() {
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
      localStorage.removeItem("session:token");
    }

    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated,
      login,
      logout,
    };
  },
  {
    persist: true, // pinia-plugin-persistedstate
  },
);
