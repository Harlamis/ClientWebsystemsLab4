<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (e: "filter-by-name", query: string): void;
}>();

const query = ref("");
let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(query, (newVal) => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    emit("filter-by-name", newVal);
  }, 300);
});
</script>

<template>
  <div class="w-full max-w-xs">
    <input
      v-model="query"
      type="text"
      placeholder="Пошук за ім'ям..."
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
</template>
