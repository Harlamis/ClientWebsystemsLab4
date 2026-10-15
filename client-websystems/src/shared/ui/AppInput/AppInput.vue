<script setup lang="ts">
import InputText from "primevue/inputtext";

defineProps<{
  modelValue: string | number;
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label
      v-if="label"
      :for="id"
      class="text-sm font-semibold text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>
    <InputText
      :id="id"
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :invalid="!!error"
      :disabled="disabled"
      class="w-full"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <span
      v-if="error"
      class="text-xs text-red-500 min-h-[16px]"
    >
      {{ error }}
    </span>
  </div>
</template>
