<script setup lang="ts">
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <nav class="flex items-center gap-4">
    <RouterLink
      to="/"
      class="px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 bg-indigo-50 font-bold"
    >
      Home
    </RouterLink>
    <RouterLink
      to="/about"
      class="px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 bg-indigo-50 font-bold"
    >
      About author
    </RouterLink>

    <RouterLink
      v-if="authStore.isAuthenticated"
      to="/users"
      class="px-3 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-600 transition-colors"
      active-class="text-indigo-600 bg-indigo-50 font-bold"
    >
      Users
    </RouterLink>
  </nav>
</template>
