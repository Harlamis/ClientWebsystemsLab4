<script setup lang="ts">
import { useRouter } from "vue-router";
import { AppButton } from "@/shared/ui";
import { useSessionStore } from "@/entities/session";
import { useTheme } from "@/shared/lib/theme";

const router = useRouter();
const sessionStore = useSessionStore();
const { isDark, toggleTheme } = useTheme();

const handleLogout = () => {
  sessionStore.logout();
  router.push("/login");
};
</script>

<template>
  <header
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40 transition-colors"
  >
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <RouterLink
          to="/"
          class="font-bold text-xl text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
        >
          <span>🎰</span>
          <span>VueLottery</span>
        </RouterLink>
        <nav class="flex gap-4">
          <RouterLink
            to="/"
            class="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-2 py-1 rounded transition-colors"
            active-class="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-2 py-1 rounded transition-colors"
            active-class="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
          >
            About author
          </RouterLink>
          <RouterLink
            v-if="sessionStore.isAuthenticated"
            to="/users"
            class="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-2 py-1 rounded transition-colors"
            active-class="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
          >
            Users
          </RouterLink>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-lg"
          title="Переключити тему"
          @click="toggleTheme"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>

        <AppButton
          v-if="sessionStore.isAuthenticated"
          severity="danger"
          variant="outlined"
          :label="`Logout (${sessionStore.user?.username})`"
          @click="handleLogout"
        />
        <RouterLink v-else to="/login">
          <AppButton label="Login" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>
