<script setup lang="ts">
import Button from "primevue/button";

defineProps<{
  label?: string;
  type?: "button" | "submit" | "reset";
  severity?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warn"
    | "help"
    | "danger"
    | "contrast";
  variant?: "text" | "outlined";
  size?: "small" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}>();

defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
</script>

<template>
  <Button
    :label="label"
    :type="type || 'button'"
    :severity="severity"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>
