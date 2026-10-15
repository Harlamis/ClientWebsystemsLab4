<script setup lang="ts">
import type { Participant } from "../types";
import BaseButton from "./BaseButton.vue";

defineProps<{
  winner: Participant;
}>();

defineEmits<{
  (e: "remove", id: string): void;
}>();
</script>

<template>
  <div
    class="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm"
  >
    <div class="flex items-center gap-3">
      <span class="text-2xl">🏆</span>
      <div>
        <p class="font-bold text-gray-800">
          {{ winner.name }}
        </p>
        <p class="text-xs text-gray-500">
          {{ winner.email }}
        </p>
      </div>
    </div>
    <BaseButton
      variant="danger"
      class="!px-2 !py-1 text-xs"
      @click="$emit('remove', winner.id)"
    >
      Видалити
    </BaseButton>
  </div>
</template>
