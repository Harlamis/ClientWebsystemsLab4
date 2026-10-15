<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Toast from "primevue/toast";
import { AppHeader } from "@/widgets/app-header";
import { useTheme } from "@/shared/lib/theme";

const route = useRoute();
const { initTheme } = useTheme();

onMounted(initTheme);

const isAuthLayout = computed(() => route.meta.layout === "auth");
</script>

<template>
  <Toast />
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors"
  >
    <AppHeader v-if="!isAuthLayout" />

    <main class="max-w-6xl w-full mx-auto p-4 md:p-6">
      <RouterView />
    </main>
  </div>
</template>
