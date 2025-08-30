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

<style scoped>
.badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
}

.badge-chip.primary {
  color: hsl(var(--primary));
  border-color: hsl(var(--primary) / 0.3);
  background: hsl(var(--primary) / 0.08);
}

.badge-chip.success {
  color: hsl(var(--success));
  border-color: hsl(var(--success) / 0.3);
  background: hsl(var(--success) / 0.08);
}

.badge-chip.warning {
  color: hsl(var(--warning));
  border-color: hsl(var(--warning) / 0.3);
  background: hsl(var(--warning) / 0.08);
}

.badge-chip.danger {
  color: hsl(var(--destructive));
  border-color: hsl(var(--destructive) / 0.3);
  background: hsl(var(--destructive) / 0.08);
}
</style>
