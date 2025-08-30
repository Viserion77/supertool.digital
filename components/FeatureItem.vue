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

.feature-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.feature-desc {
  margin: 0;
  color: var(--muted);
  max-width: 560px;
}
</style>
