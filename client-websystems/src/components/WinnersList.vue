<script setup lang="ts">
import type { Participant } from "../types";
import BaseButton from "./BaseButton.vue";
import WinnerCard from "./WinnerCard.vue";

defineProps<{
  winners: Participant[];
  canSelectWinner: boolean;
}>();

defineEmits<{
  (e: "select-winner"): void;
  (e: "remove-winner", id: string): void;
}>();
</script>

<template>
  <div
    class="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col gap-4"
  >
    <div class="flex justify-between items-center border-b pb-3">
      <h2 class="text-xl font-bold text-gray-800">
        Переможці ({{ winners.length }}/3)
      </h2>
      <BaseButton :disabled="!canSelectWinner" @click="$emit('select-winner')">
        New winner
      </BaseButton>
    </div>

    <div v-if="winners.length === 0" class="text-center py-6 text-gray-400">
      Переможців ще не обрано
    </div>

    <div v-else class="flex flex-col gap-3">
      <WinnerCard
        v-for="winner in winners"
        :key="winner.id"
        :winner="winner"
        @remove="$emit('remove-winner', $event)"
      />
    </div>
  </div>
</template>
