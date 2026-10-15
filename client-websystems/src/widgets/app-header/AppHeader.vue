<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Logo from "./Logo.vue";
import AppNavigation from "./AppNavigation.vue";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
};
</script>

<template>
  <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <Logo />
        <AppNavigation />
      </div>

      <div>
        <button
          v-if="authStore.isAuthenticated"
          class="px-4 py-2 bg-red-50 text-red-600 rounded-md font-medium hover:bg-red-100 transition-colors"
          @click="handleLogout"
        >
          Logout ({{ authStore.user?.username }})
        </button>
        <RouterLink
          v-else
          to="/login"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          Login
        </RouterLink>
      </div>
    </div>
  </header>
</template>
