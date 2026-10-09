<script setup lang="ts">
import AppHeader from "../components/AppHeader.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <AppHeader />
    <main class="flex-grow max-w-6xl w-full mx-auto p-4 md:p-6">
      <slot />
    </main>
  </div>
</template>
