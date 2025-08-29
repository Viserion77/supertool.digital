<template>
  <div class="feature-item">
    <div class="feature-icon" :class="variant">
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
