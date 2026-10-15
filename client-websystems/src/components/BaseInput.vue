<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  id: string;
  error?: string;
  placeholder?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label
      :for="id"
      class="text-sm font-semibold text-gray-700"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :class="[
        'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors',
        error
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <span
      v-if="error"
      class="text-xs text-red-600 min-h-[16px]"
    >
      {{ error }}
    </span>
  </div>
</template>