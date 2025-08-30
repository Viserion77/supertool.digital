<template>
  <span class="badge-chip" :class="variant">
    <slot name="icon" />
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "neutral" | "primary" | "success" | "warning" | "danger";
  }>(),
  {
    variant: "neutral",
  },
);
</script>
