<template>
  <div class="brand-logo" :aria-label="ariaLabel">
    <span class="logo" :style="{ ['--logo-size']: size + 'px' }">ST</span>
    <div v-if="showText">
      <span class="brand-name">SuperTool</span>
      <span class="brand-tld">.digital</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const _props = withDefaults(
  defineProps<{ size?: number; showText?: boolean; ariaLabel?: string }>(),
  {
    size: 32,
    showText: true,
    ariaLabel: "SuperTool.digital",
  },
);
</script>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
</style>
