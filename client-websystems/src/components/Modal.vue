<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    emit("close");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all"
      @click.stop
    >
      <div class="p-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-800">
          <slot name="title" />
        </h3>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600 font-bold text-xl leading-none"
          @click="$emit('close')"
        >
          &times;
        </button>
      </div>

      <div class="p-6">
        <slot name="body" />
      </div>

      <div
        v-if="$slots.footer"
        class="p-4 border-t bg-gray-50 flex justify-end gap-2"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
