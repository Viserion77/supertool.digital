<template>
  <div class="feature-item">
    <div class="ui-feature-icon" :class="variant">
      <component :is="icon" :size="22" aria-hidden="true" />
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
const _props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    icon: Component;
    variant?: "green" | "gray" | "yellow" | "blue";
  }>(),
  { variant: "gray" },
);
</script>

<style scoped>
.feature-item {
  background: transparent;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.ui-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
}

.ui-feature-icon.green {
  background: var(--gradient-feature-green);
  color: var(--color-green, #10b981);
}

.ui-feature-icon.blue {
  background: var(--gradient-feature-blue);
  color: var(--color-blue, #3b82f6);
}

.ui-feature-icon.yellow {
  background: var(--gradient-feature-yellow);
  color: var(--color-yellow, #f59e0b);
}

.ui-feature-icon.gray {
  background: var(--gradient-feature-gray);
  color: var(--color-gray, #94a3b8);
}

.feature-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.feature-desc {
  margin: 0;
  color: var(--muted);
  max-width: 560px;
  line-height: 1.6;
}
</style>
