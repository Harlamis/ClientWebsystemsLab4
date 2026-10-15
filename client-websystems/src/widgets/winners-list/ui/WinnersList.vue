<script setup lang="ts">
import { AppButton } from "@/shared/ui";
import type { User } from "@/entities/user";

defineProps<{
  winners: User[];
  canSelectWinner: boolean;
}>();

defineEmits<{
  (e: "select-winner"): void;
  (e: "remove-winner", id: number): void;
}>();
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col gap-4 transition-colors"
  >
    <div
      class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3"
    >
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
          Переможці ({{ winners.length }}/3)
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Випадковий вибір серед учасників
        </p>
      </div>
      <AppButton
        label="New winner 🏆"
        severity="warn"
        :disabled="!canSelectWinner"
        @click="$emit('select-winner')"
      />
    </div>

    <div
      v-if="winners.length === 0"
      class="text-center py-6 text-gray-400 dark:text-gray-500"
    >
      Переможців ще не обрано
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div
        v-for="winner in winners"
        :key="winner.id"
        class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg flex items-center justify-between shadow-sm"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <span class="text-2xl">🏆</span>
          <div class="truncate">
            <p
              class="font-bold text-sm text-gray-900 dark:text-amber-100 truncate"
            >
              {{ winner.firstName }} {{ winner.lastName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-amber-300/70 truncate">
              {{ winner.email }}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 font-bold text-xs transition-colors ml-2"
          title="Видалити переможця"
          @click="$emit('remove-winner', winner.id)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
