<script setup lang="ts">
import { LoginForm } from "@/features/auth";
</script>

<template>
  <div class="flex flex-col gap-6 max-w-sm mx-auto">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Авторизація
      </h1>
      <p class="text-xs text-gray-500 mt-1">
        Тестові дані: emilys / emilyspass
      </p>
    </div>
    <LoginForm />
  </div>
</template>
