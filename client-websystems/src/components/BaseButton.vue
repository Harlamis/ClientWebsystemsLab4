<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'danger'
        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
        : variant === 'secondary'
        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400'
        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>